'use client';

import { useEffect, useRef } from 'react';

// A real-time WebGL glass sculpture. The old CSS blobs remain as a static fallback
// for browsers without WebGL and for reduced-motion preferences.
const vertexShader = String.raw`
attribute vec2 position;
varying vec2 uv;
void main(){uv = position * .5 + .5; gl_Position = vec4(position,0.,1.);}
`;
const fragmentShader = String.raw`
precision highp float;
varying vec2 uv;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
uniform float darkMode;

vec3 backdrop(vec2 p) {
  float x=p.x, y=p.y;
  vec3 a=mix(vec3(.88,.94,1.),vec3(.81,.79,.98),smoothstep(-.45,.3,y));
  a=mix(a,vec3(1.,.88,.91),smoothstep(.06,.63,x-y*.21)*.45);
  a+=vec3(.09,.09,.045)*exp(-dot(p-vec2(-.32,.37),p-vec2(-.32,.37))*7.);
  a+=vec3(.08,.04,.09)*exp(-dot(p-vec2(.4,-.39),p-vec2(.4,-.39))*9.);
  if(darkMode>.5){a=a*vec3(.23,.20,.35)+vec3(.035,.04,.085);}
  return a;
}
float shape(vec2 p, vec2 pos, vec2 r, float t) {
  vec2 q=(p-pos)/r;
  float theta=atan(q.y,q.x);
  return length(q)-1. + .033*sin(theta*3.+t*.35)+.018*sin(theta*5.-t*.21);
}
vec3 glass(vec3 base, vec2 p, vec2 center, vec2 r, vec3 dye, float t) {
  float d=shape(p,center,r,t);
  if(d>.095) return base;
  float inside=1.-smoothstep(-.006,.012,d);
  float edge=exp(-abs(d)*51.);
  float rimInner=exp(-abs(d+.043)*27.);
  vec2 q=(p-center)/r;
  float z=sqrt(max(.01,1.-min(dot(q,q),.99)));
  vec3 normal=normalize(vec3(q.x,q.y,z*.92));
  float fresnel=pow(1.-max(normal.z,0.),2.3);
  vec2 refraction=normal.xy*(.048+.075*fresnel);
  vec3 optical=backdrop(p-refraction);
  float sky=pow(max(dot(normal,normalize(vec3(-.44,.72,.58))),0.),15.);
  float glint=pow(max(dot(normal,normalize(vec3(-.57,.68,.45))),0.),85.);
  float glint2=pow(max(dot(normal,normalize(vec3(.65,-.23,.65))),0.),30.);
  float shade=.76+.25*normal.z-.22*normal.x+.13*normal.y;
  vec3 body=mix(base,optical,.7)*shade;
  body=mix(body, dye, .14+.18*fresnel);
  body+=vec3(.22,.23,.30)*sky+vec3(.65,.68,.75)*glint+vec3(.35,.32,.4)*glint2;
  body+=dye*(rimInner*.19);
  base=mix(base,body,inside*.91);
  float lightSide=clamp(.66-.26*q.x+.28*q.y,0.,1.);
  base+=vec3(1.,.98,1.)*edge*(.14+.42*lightSide);
  base-=dye*.20*edge*(1.-lightSide);
  float whiteArc=exp(-pow((q.x+.37)*5.,2.)-pow((q.y-.57)*11.,2.));
  base+=vec3(.42,.49,.58)*inside*whiteArc;
  return base;
}
void main() {
  vec2 p=(uv-.5)*vec2(resolution.x/max(resolution.y,1.),1.);
  float t=time;
  vec2 mouse=pointer*.018;
  vec3 col=backdrop(p);
  vec2 c1=vec2(-.18,.39)+vec2(.025*sin(t*.14),.018*cos(t*.11))+mouse*.33;
  vec2 c2=vec2(.22,.075)+vec2(-.024*sin(t*.09),.03*cos(t*.13))-mouse*.22;
  vec2 c3=vec2(-.175,-.39)+vec2(.03*cos(t*.12),.02*sin(t*.10))+mouse*.3;
  // Each pearlescent volume has refracted inner light, Fresnel edges and specular highlights.
  col=glass(col,p,c1,vec2(.205,.24),vec3(.53,.61,.98),t);
  col=glass(col,p,c2,vec2(.19,.245),vec3(.75,.55,.91),t+2.);
  col=glass(col,p,c3,vec2(.245,.195),vec3(.68,.78,.98),t+4.);
  col=pow(max(col,0.),vec3(.96));
  gl_FragColor=vec4(clamp(col,0.,1.),1.);
}
`;

export function LiquidGlassScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;
    const makeShader=(kind:number,code:string) => {
      const shader=gl.createShader(kind);
      if(!shader) return null;
      gl.shaderSource(shader,code);
      gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
        console.warn('LiquidGlass: shader unavailable',gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const vert=makeShader(gl.VERTEX_SHADER,vertexShader);
    const frag=makeShader(gl.FRAGMENT_SHADER,fragmentShader);
    if(!vert || !frag) return;
    const program=gl.createProgram();
    if(!program) return;
    gl.attachShader(program,vert);
    gl.attachShader(program,frag);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer=gl.createBuffer();
    if(!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const uniforms={
      resolution:gl.getUniformLocation(program,'resolution'),
      pointer:gl.getUniformLocation(program,'pointer'),
      time:gl.getUniformLocation(program,'time'),
      darkMode:gl.getUniformLocation(program,'darkMode')
    };
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const dark=window.matchMedia('(prefers-color-scheme: dark)');
    const mouse={x:0,y:0};
    let raf=0,last=0,seconds=0,disposed=false;
    const isDark=()=>{const t=document.documentElement.dataset.theme;return t==='dark'||(t!=='light'&&dark.matches);};
    const resize=()=>{
      const width=canvas.clientWidth,height=canvas.clientHeight;
      if(!width||!height)return;
      const dpr=Math.min(window.devicePixelRatio||1,1.4);
      canvas.width=Math.round(width*dpr);
      canvas.height=Math.round(height*dpr);
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform2f(uniforms.resolution,width,height);
    };
    const draw=()=>{
      if(disposed||gl.isContextLost())return;
      gl.uniform1f(uniforms.time,seconds);
      gl.uniform1f(uniforms.darkMode,isDark()?1:0);
      gl.uniform2f(uniforms.pointer,mouse.x,mouse.y);
      gl.drawArrays(gl.TRIANGLES,0,3);
    };
    const tick=(stamp:number)=>{
      if(disposed||document.hidden)return;
      raf=requestAnimationFrame(tick);
      if(stamp-last<1000/30)return;
      seconds+=Math.min((stamp-last)/1000,.06);
      last=stamp;
      draw();
    };
    const restart=()=>{
      cancelAnimationFrame(raf);raf=0;last=performance.now();
      draw();
      if(!reduced.matches&&!document.hidden)raf=requestAnimationFrame(tick);
    };
    const move=(event:PointerEvent)=>{
      mouse.x=(event.clientX/window.innerWidth-.5)*2;
      mouse.y=(.5-event.clientY/window.innerHeight)*2;
    };
    const resizeHandler=()=>{resize();draw();};
    const observer=new MutationObserver(()=>draw());
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    window.addEventListener('resize',resizeHandler);
    window.addEventListener('pointermove',move,{passive:true});
    document.addEventListener('visibilitychange',restart);
    reduced.addEventListener('change',restart);
    dark.addEventListener('change',restart);
    resize();draw();canvas.dataset.ready='true';restart();
    return ()=>{
      disposed=true;cancelAnimationFrame(raf);observer.disconnect();
      window.removeEventListener('resize',resizeHandler);
      window.removeEventListener('pointermove',move);
      document.removeEventListener('visibilitychange',restart);
      reduced.removeEventListener('change',restart);
      dark.removeEventListener('change',restart);
      canvas.dataset.ready='false';
      gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vert);gl.deleteShader(frag);
    };
  },[]);

  return <canvas ref={ref} className="liquid-glass-canvas" aria-hidden="true" />;
}
