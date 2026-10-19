/* Two independent passes: a stationary forest and an isolated moving sapling.
   No video, animation library, tracking, or external requests. */
import { plantProfiles, createPlantMask } from './plant-contours-401c6721bee1.js';
(() => {
  'use strict';
  const sceneFiles={"desktop": "forest-roots-desktop-40bad3ef89cf.webp", "mobile": "forest-roots-mobile-4c649d8b90d6.webp"};
  const cleanFiles={"desktop": "forest-clean-desktop-d77e593ca284.webp", "mobile": "forest-clean-mobile-63110cbb2f3a.webp"};
  const hero = document.querySelector('.grounded-hero');
  const canvas = document.querySelector('#breeze-canvas');
  const image = document.querySelector('#scene-image');
  const toggle = document.querySelector('#motion-toggle');
  const menu = document.querySelector('#site-menu');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = matchMedia('(max-width: 1000px) and (orientation: portrait)');
  image.addEventListener('dragstart', event => event.preventDefault());
  const gl = canvas.getContext('webgl', {alpha:false, antialias:false, depth:false, stencil:false, powerPreference:'low-power'});
  if (!gl) { hero.dataset.motion = 'static-fallback'; return; }
  const vertex = `
    precision highp float;
    attribute vec2 a_uv;
    varying vec2 v_uv;
    varying float v_leafLight;
    uniform float u_time;
    uniform float u_amount;
    uniform float u_aspect;
    uniform mediump float u_pass;
    uniform vec2 u_span;
    uniform mediump vec3 u_plant;
    uniform vec4 u_leaf[6];
    uniform vec2 u_pivot[6];
    float softOval(vec2 uv, vec4 oval) {
      float d = length((uv - oval.xy) / oval.zw);
      return 1.0 - smoothstep(0.58, 1.3, d);
    }
    // A soft gust passes for five seconds, then the scene rests for almost four.
    // Zero velocity at each end keeps the idle cycle from looking like a restart.
    float gustAt(float t) {
      float phase = mod(max(t,0.0),8.8);
      return smoothstep(0.0,1.25,phase) * (1.0 - smoothstep(3.55,5.15,phase));
    }
    void main() {
      v_uv = vec2(a_uv.x, 1.0 - a_uv.y);
      v_leafLight = 0.0;
      vec2 uv = a_uv;
      vec2 shift = vec2(0.0);
      float ground = u_plant.y;
      if(u_pass < .5) {
        float y=(1.0-uv.y*2.0)*u_span.y+(u_span.y-1.0)*(2.0*ground-1.0);
        gl_Position=vec4((uv.x*2.0-1.0)*u_span.x,y,0.0,1.0);
        return;
      }
      // Every vertex at and below the root collar remains exactly stationary.
      float above = 1.0 - smoothstep(ground - 0.045, ground - 0.008, uv.y);
      float growth = clamp((ground - uv.y) / (ground - u_plant.z), 0.0, 1.0);
      float envelope = 1.0 - smoothstep(0.12, 0.27, abs(uv.x - u_plant.x));
      float cycle = mod(u_time + .65,8.8);
      float gust = gustAt(u_time + .65);
      float wind = gust * (sin(cycle * 1.1 - .25) * .84 + sin(cycle * 1.93) * .16);
      shift.x += .0075 * wind * pow(growth, 1.5) * envelope * above;
      for(int i=0;i<6;i++) {
        float n = float(i);
        float leaf = softOval(uv,u_leaf[i]) * above;
        vec2 delta = (uv - u_pivot[i]) * vec2(u_aspect,1.0);
        // Each leaf follows the gust with a short delay from its petiole to its tip.
        float localTime = max(0.0,u_time + .65 - n * .065);
        float localGust = gustAt(localTime);
        float phase = mod(localTime,8.8);
        float angle = localGust * (.038 * sin(phase * 1.24 - n * .16) + .009 * sin(phase * 2.15 + n * .38));
        vec2 axis = normalize((u_leaf[i].xy-u_pivot[i]) * vec2(u_aspect,1.0));
        vec2 normal = vec2(-axis.y,axis.x);
        float lengthToCenter = length((u_leaf[i].xy-u_pivot[i]) * vec2(u_aspect,1.0));
        float along = clamp(dot(delta,axis) / max(lengthToCenter,0.001),0.0,1.7);
        float attached = smoothstep(0.0,.5,along);
        shift += vec2(-delta.y / u_aspect, delta.x) * angle * leaf * attached;
        // Slightly roll the leaf blade about its midrib, leaving the vein attached.
        // This adds a shallow edge curl and a small change in reflected light.
        float halfWidth = min(u_leaf[i].z*u_aspect,u_leaf[i].w);
        float across = dot(delta,normal);
        float edgeOfLeaf = clamp(abs(across) / max(halfWidth,0.001),0.0,1.2);
        float roll = localGust * sin(phase * 1.5 - along * .75 + n * .33);
        float fold = (-across * .065 + halfWidth * .035 * edgeOfLeaf * edgeOfLeaf) * roll * attached;
        shift += normal / vec2(u_aspect,1.0) * fold * leaf;
        v_leafLight += .04 * roll * clamp(across/max(halfWidth,0.001),-1.0,1.0) * leaf * attached * u_amount;
      }
      // The background pass has no displacement, including the gaps between leaves.
      uv += shift * u_amount * u_pass;
      // Match object-position to the soil line so wide screens do not enlarge the cutaway.
      float anchoredY = (1.0 - uv.y * 2.0) * u_span.y + (u_span.y - 1.0) * (2.0 * ground - 1.0);
      gl_Position = vec4((uv.x * 2.0 - 1.0) * u_span.x, anchoredY,0.0,1.0);
    }`;
  const fragment = `
    precision mediump float;
    varying vec2 v_uv;
    varying float v_leafLight;
    uniform sampler2D u_scene;
    uniform sampler2D u_clean;
    uniform sampler2D u_mask;
    uniform float u_pass;
    uniform vec3 u_plant;
    void main(){
      if(u_pass < .5) {
        vec4 color = texture2D(u_scene,v_uv);
        // A continuous clean forest plate avoids patch seams behind moving leaves.
        // The source image supplies the unchanged soil/root cross-section.
        float above = smoothstep(1.0-u_plant.y,1.0-u_plant.y+.025,v_uv.y);
        color.rgb = mix(color.rgb,texture2D(u_clean,v_uv).rgb,above);
        gl_FragColor = vec4(color.rgb,1.0);
      } else {
        float alpha = texture2D(u_mask,v_uv).r;
        if(alpha < .002) discard;
        vec4 color = texture2D(u_scene,v_uv);
        gl_FragColor = vec4(color.rgb * (1.0 + v_leafLight),alpha);
      }
    }`;
  function shader(type, source) {
    const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  let program;
  try {
    program=gl.createProgram();
    gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch(error) { console.warn('Breeze unavailable; still artwork remains.',error);hero.dataset.motion='static-fallback';return; }
  gl.useProgram(program);
  const uniforms={};
  for(const key of ['time','amount','aspect','span','plant','leaf[0]','pivot[0]','pass']) uniforms[key]=gl.getUniformLocation(program,'u_'+key);
  const cols=140, rows=100, vertices=[];
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) {
    const u=x/cols,v=y/rows,du=1/cols,dv=1/rows;
    vertices.push(u,v,u+du,v,u,v+dv,u,v+dv,u+du,v,u+du,v+dv);
  }
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
  const aUV=gl.getAttribLocation(program,'a_uv');gl.enableVertexAttribArray(aUV);gl.vertexAttribPointer(aUV,2,gl.FLOAT,false,0,0);
  const backdropBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,backdropBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),gl.STATIC_DRAW);
  const textures = ['scene','clean','mask'].map((name,unit) => {
    const texture=gl.createTexture();
    gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program,'u_'+name),unit);
    return texture;
  });
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  let frame=0,ready=false,userPaused=false,inView=true,menuOpen=!menu.hidden,elapsed=0,last=0,source='',generation=0,contextLost=false;
  let span=[1,1];
  try{userPaused=localStorage.getItem('mycelium-grounded-breeze')==='paused';}catch(_e){}
  let siteMotion=true;
  try{siteMotion=localStorage.getItem('mycelium-studies-motion')!=='off';}catch(_e){}
  function running(){return ready&&!contextLost&&!userPaused&&!reducedMotion.matches&&siteMotion&&!document.hidden&&inView&&!menuOpen;}
  function draw(){
    if(!ready||contextLost)return;
    gl.uniform1f(uniforms.time,elapsed);gl.uniform1f(uniforms.amount,(reducedMotion.matches||!siteMotion)?0:1);
    gl.disable(gl.BLEND);
    gl.uniform1f(uniforms.pass,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,backdropBuffer);gl.vertexAttribPointer(aUV,2,gl.FLOAT,false,0,0);
    gl.drawArrays(gl.TRIANGLES,0,6);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1f(uniforms.pass,1);
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.vertexAttribPointer(aUV,2,gl.FLOAT,false,0,0);
    gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);
  }
  function tick(now){
    frame=0;if(!running()){last=0;return;}
    if(last)elapsed+=Math.min((now-last)/1000,.05);
    last=now;draw();frame=requestAnimationFrame(tick);
  }
  function sync(){
    const reduced=reducedMotion.matches||!siteMotion;
    toggle.hidden=!ready;
    toggle.disabled=reduced;
    toggle.setAttribute('aria-pressed',String(userPaused||reduced));
    toggle.querySelector('.motion-label').textContent=reduced?'Motion reduced':userPaused?'Play breeze':'Pause breeze';
    toggle.querySelector('.motion-icon').textContent=reduced?'—':userPaused?'▷':'Ⅱ';
    hero.dataset.motion=reduced?'reduced':userPaused?'paused':running()?'playing':'idle';
    if(running()){if(!frame){last=0;frame=requestAnimationFrame(tick);}}
    else{if(frame)cancelAnimationFrame(frame);frame=0;last=0;draw();}
  }
  function resize(){
    if(!ready)return;
    const rect=hero.getBoundingClientRect();
    const cover=Math.max(rect.width/image.naturalWidth,rect.height/image.naturalHeight);
    const nativeRatio=Math.max(1,1/cover);
    const dpr=Math.min(devicePixelRatio||1,2,nativeRatio);
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    gl.viewport(0,0,canvas.width,canvas.height);
    span=[image.naturalWidth*cover/rect.width,image.naturalHeight*cover/rect.height];
    gl.uniform2fv(uniforms.span,span);
    draw();
  }
  async function loadImage(){
    const ticket=++generation;
    const nextSource=image.currentSrc || new URL(sceneFiles[portrait.matches?'mobile':'desktop'],import.meta.url).href;
    if(nextSource===source&&ready){resize();return;}
    canvas.classList.remove('ready');ready=false;sync();
    const kind=nextSource.includes('-mobile')?'mobile':'desktop';
    const profile=plantProfiles[kind];
    const clean=new Image();
    clean.src=new URL(cleanFiles[kind],import.meta.url).href;
    try { await Promise.all([image.decode(),clean.decode()]); } catch(error) {
      if(ticket!==generation)return;
      console.warn('Forest layer unavailable; still artwork remains.',error);
      hero.dataset.motion='static-fallback';return;
    }
    if(ticket!==generation||contextLost||image.currentSrc!==nextSource)return;
    source=nextSource;
    const layers=[image,clean,createPlantMask(profile)];
    layers.forEach((layer,unit)=>{
      gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,textures[unit]);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,layer);
    });
    gl.uniform1f(uniforms.aspect,image.naturalWidth/image.naturalHeight);
    gl.uniform3fv(uniforms.plant,new Float32Array(profile.plant));
    gl.uniform4fv(uniforms['leaf[0]'],new Float32Array(profile.leaves));
    gl.uniform2fv(uniforms['pivot[0]'],new Float32Array(profile.pivots));
    ready=true;resize();canvas.classList.add('ready');sync();

  }
  image.addEventListener('load',loadImage);
  loadImage();
  new ResizeObserver(resize).observe(hero);
  portrait.addEventListener('change',()=>{canvas.classList.remove('ready');ready=false;source='';sync();requestAnimationFrame(loadImage);});
  toggle.addEventListener('click',()=>{userPaused=!userPaused;try{localStorage.setItem('mycelium-grounded-breeze',userPaused?'paused':'playing');}catch(_e){}sync();});
  reducedMotion.addEventListener('change',sync);
  document.addEventListener('study-motion',event=>{siteMotion=event.detail;sync();});
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();}).observe(hero);
  new MutationObserver(()=>{menuOpen=!menu.hidden;sync();}).observe(menu,{attributes:true,attributeFilter:['hidden']});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();contextLost=true;ready=false;canvas.classList.remove('ready');toggle.hidden=true;if(frame)cancelAnimationFrame(frame);frame=0;hero.dataset.motion='static-fallback';});
})();
