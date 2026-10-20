// No network, accounts, emails or database writes: exercise the shipped browser
// script with a deliberately fake Supabase client, including the stale-session bug.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const source=readFileSync(new URL('../public/redesign/auth.js',import.meta.url),'utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function page(options={}){
  const calls=[],navigations=[],listeners=[];
  const status={textContent:''},label={textContent:'Sign in'},resume={hidden:true};
  const button={disabled:false,querySelector:()=>label};
  const fields=new Map(Object.entries({'si-email':'member@example.test','si-pass':'test-only-password','su-email':'new@example.test','su-pass':'test-only-password','su-name':'New member','su-location':'','su-practice':'curious','rc-email':'member@example.test'}).map(([id,value])=>[id,{value}]));
  const user={id:'test-user',user_metadata:{username:'Existing member'}};
  const query={select(){return this;},eq(column,id){calls.push(['profile-read',column,id]);return this;},async maybeSingle(){return options.profileError?{data:null,error:new Error('Offline')}:{data:options.missingProfile?null:{id:user.id}};},async insert(){calls.push(['profile-insert']);return {};}};
  const client={from(table){assert.equal(table,'profiles');return query;},auth:{
    async getSession(){calls.push(['getSession']);return {data:{session:options.savedSession?{user}:null}};},
    async getUser(){calls.push(['getUser']);return options.invalidSession?{data:{user:null},error:new Error('Expired')}:{data:{user}};},
    async signInWithPassword(){calls.push(['signIn']);return options.badPassword?{data:{},error:new Error('Invalid login credentials')}:{data:{user,session:{user}}};},
    async signUp(){calls.push(['signUp']);return {data:{user,session:options.confirmEmail?null:{user}}};},
    async resetPasswordForEmail(){calls.push(['recovery']);return {};}
  }};
  const form={dataset:{liveAuth:options.kind||'sign-in'},querySelector:s=>s==='[type=submit]'?button:status,reportValidity:()=>true,addEventListener:(name,fn)=>listeners.push(fn)};
  let clientCount=0;
  const document={querySelector:s=>s==='[data-live-auth]'?form:s==='[data-auth-resume]'?resume:{content:'public-test-value'},getElementById:id=>fields.get(id)};
  vm.runInNewContext(source,{document,window:{supabase:{createClient(){clientCount++;return client;}}},location:{origin:'https://example.test',hash:'',search:'',assign:url=>navigations.push(url),replace:url=>navigations.push(url)}});
  return {calls,navigations,status,resume,button,clientCount:()=>clientCount,submit:()=>listeners[0]({preventDefault(){}})};
}

test('visitors without a session keep the new page',async()=>{const p=page();await flush();assert.deepEqual(p.navigations,[]);assert.equal(p.resume.hidden,true);assert.deepEqual(p.calls,[['getSession']]);});
test('a stale saved session cannot send visitors to the old form',async()=>{const p=page({savedSession:true,invalidSession:true});await flush();assert.deepEqual(p.navigations,[]);assert.equal(p.resume.hidden,true);assert.equal(p.calls.some(c=>c[0]==='profile-read'),false);});
test('a valid member gets an explicit continue link, never an automatic redirect',async()=>{const p=page({savedSession:true});await flush();assert.deepEqual(p.navigations,[]);assert.equal(p.resume.hidden,false);assert.equal(p.calls.some(c=>c[0]==='profile-insert'),false);});
test('missing profiles and read failures leave the approved form available',async()=>{for(const opts of [{missingProfile:true},{profileError:true}]){const p=page({savedSession:true,...opts});await flush();assert.deepEqual(p.navigations,[]);assert.equal(p.resume.hidden,true);assert.equal(p.button.disabled,false);}});
test('successful explicit sign-in still opens the unchanged forum',async()=>{const p=page();await p.submit();await flush();assert.deepEqual(p.navigations,['/common-ground/']);assert.equal(p.clientCount(),1);assert.equal(p.calls.some(c=>c[0]==='profile-insert'),false);});
test('bad credentials remain on the new screen with a useful error',async()=>{const p=page({badPassword:true});await p.submit();assert.deepEqual(p.navigations,[]);assert.match(p.status.textContent,/email and password do not match/);assert.equal(p.button.disabled,false);});
test('signup awaiting email confirmation does not create a profile or navigate',async()=>{const p=page({kind:'join',confirmEmail:true});await p.submit();assert.deepEqual(p.navigations,[]);assert.match(p.status.textContent,/confirm your email/);assert.deepEqual(p.calls,[['signUp']]);});
test('new signup and recovery retain their existing flows',async()=>{const join=page({kind:'join',missingProfile:true});await join.submit();assert.deepEqual(join.navigations,['/common-ground/']);assert.equal(join.calls.filter(c=>c[0]==='profile-insert').length,1);const recover=page({kind:'recover'});await recover.submit();assert.deepEqual(recover.calls,[['recovery']]);assert.deepEqual(recover.navigations,[]);assert.match(recover.status.textContent,/reset link/);});
