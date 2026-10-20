/* Standalone approved account screens; Common Ground's application is untouched.
   Uses the same public Supabase project, session storage key and profiles schema. */
(() => {
  const form=document.querySelector('[data-live-auth]');
  if(!form)return;
  const kind=form.dataset.liveAuth,status=form.querySelector('[data-form-status]'),button=form.querySelector('[type=submit]');
  const get=id=>document.getElementById(id),value=id=>get(id)?.value.trim()||'';
  let busy=false,client,connecting;
  const message=text=>{status.textContent=text;};
  const friendly=error=>{
    const text=error?.message||'We could not reach Common Ground. Please try again.';
    if(/invalid login credentials/i.test(text))return 'That email and password do not match. Check for a typo, or use “Forgot password?”.';
    if(/email not confirmed/i.test(text))return 'Confirm your email first, then come back and sign in.';
    if(/rate limit|too many/i.test(text))return 'Too many tries in a row. Wait a minute, then try again.';
    return text;
  };
  async function connect(){
    if(client)return client;
    if(!connecting)connecting=(async()=>{
      if(!window.supabase)await new Promise((resolve,reject)=>{
        const script=document.createElement('script');
        script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload=resolve;script.onerror=()=>reject(new Error('Unable to connect. Please check your connection and try again.'));
        document.head.append(script);
      });
      client=window.supabase.createClient(document.querySelector('meta[name=cg-url]').content,document.querySelector('meta[name=cg-anon-key]').content);
      return client;
    })().catch(error=>{connecting=null;throw error;});
    return connecting;
  }
  async function ensureOwnProfile(sb,user,fields){
    const {data:profile,error:readError}=await sb.from('profiles').select('id').eq('id',user.id).maybeSingle();
    if(readError)throw readError;
    if(profile)return; // Never replace or update an existing member's profile.
    const meta=fields||user.user_metadata||{};
    if(!meta.username)throw new Error('Profile not found. Please contact the organizer through the feedback page.');
    const colors=['#C4872A','#4a7c59','#5b7fa6','#8a5a78','#c0703e','#5f7d4f'];
    const {error}=await sb.from('profiles').insert({id:user.id,username:meta.username,bio:'',location:meta.location||'',practice:meta.practice||'curious',avatar_color:colors[Math.floor(Math.random()*colors.length)],is_admin:false});
    if(error)throw new Error(error.code==='23505'?'That name is already taken. Please contact the organizer to finish your account.':error.message);
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy||!form.reportValidity())return;
    busy=true;button.disabled=true;const label=button.querySelector('span'),old=label?.textContent;
    if(label)label.textContent=kind==='join'?'Creating your account…':kind==='recover'?'Sending your link…':'Signing you in…';
    message('');
    try{
      const sb=await connect();
      if(kind==='recover'){
        const {error}=await sb.auth.resetPasswordForEmail(value('rc-email'),{redirectTo:location.origin+'/recover/'});
        if(error)throw error;
        message('If an account uses that email, you’ll receive a reset link. Check your inbox.');
      }else if(kind==='join'){
        const fields={username:value('su-name'),location:value('su-location'),practice:value('su-practice')};
        const {data,error}=await sb.auth.signUp({email:value('su-email'),password:get('su-pass').value,options:{data:fields,emailRedirectTo:location.origin+'/sign-in/'}});
        if(error)throw error;
        if(!data?.session){message('Check your inbox to confirm your email, then return here to sign in.');get('su-pass').value='';return;}
        await ensureOwnProfile(sb,data.user,fields);
        location.assign('/common-ground/');
      }else{
        const {data,error}=await sb.auth.signInWithPassword({email:value('si-email'),password:get('si-pass').value});
        if(error)throw error;
        await ensureOwnProfile(sb,data.user);
        location.assign('/common-ground/');
      }
    }catch(error){message(friendly(error));}
    finally{busy=false;button.disabled=false;if(label)label.textContent=old;}
  });
  if(kind==='sign-in')connect().then(async sb=>{
    // A saved session is only a hint. Never replace the approved account page
    // on a timer: a stale session used to land visitors on the legacy form.
    const {data:{session},error:sessionError}=await sb.auth.getSession();
    if(sessionError||!session)return;
    const {data:{user},error:userError}=await sb.auth.getUser();
    if(userError||!user||busy)return;
    const {data:profile,error:profileError}=await sb.from('profiles').select('id').eq('id',user.id).maybeSingle();
    const resume=document.querySelector('[data-auth-resume]');
    if(profile&&!profileError&&!busy&&resume)resume.hidden=false;
  }).catch(()=>{});
  // Supabase recovery links establish a short-lived authenticated session. The
  // new password goes directly to Supabase; it is never logged or stored here.
  if(kind==='recover' && /(?:type=recovery|access_token=|code=)/.test(location.hash+location.search)){
    connect().then(async sb=>{
      const {data:{session}}=await sb.auth.getSession();
      if(!session){message('This reset link has expired. Request a new one.');return;}
      const emailField=form.querySelector('.account-field');
      emailField.innerHTML='<label for="new-password">New password</label><input id="new-password" type="password" autocomplete="new-password" minlength="6" required><p class="account-hint">At least 6 characters.</p>';
      button.querySelector('span').textContent='Save new password';
      form.addEventListener('submit',async event=>{
        event.preventDefault();event.stopImmediatePropagation();
        if(busy||!form.reportValidity())return;
        busy=true;button.disabled=true;
        try{const {error}=await sb.auth.updateUser({password:get('new-password').value});if(error)throw error;location.assign('/common-ground/');}
        catch(error){message(friendly(error));}
        finally{busy=false;button.disabled=false;}
      },true);
    }).catch(error=>message(friendly(error)));
  }
})();
