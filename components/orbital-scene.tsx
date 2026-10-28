'use client';

import { useEffect, useRef } from 'react';

const vertex = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Depth-parallax compositor: the Earth and distant sky move at different speeds.
// It uses the same local wallpaper as the CSS fallback, never project previews.
const fragment = `
precision highp float;
uniform sampler2D earth;
uniform vec2 resolution;
uniform vec2 pointer;
uniform vec2 imageSize;
uniform float time;
uniform float motion;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  float viewRatio = resolution.x / resolution.y;
  float imageRatio = imageSize.x / imageSize.y;
  vec2 cover = vec2(min(viewRatio / imageRatio, 1.0), min(imageRatio / viewRatio, 1.0));
  vec2 uv = (vUv - 0.5) * cover + 0.5;
  float depth = 1.0 - smoothstep(0.10, 0.91, length((uv - vec2(0.43, 0.45)) * vec2(0.85, 1.0)));
  vec2 p = uv - vec2(0.39, 0.47);
  float angle = sin(time * 0.025) * 0.009 * motion;
  p = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p;
  uv = p + vec2(0.39, 0.47);
  uv += pointer * vec2(0.013, 0.009) * (depth * 0.8 + 0.2);
  uv.x += sin(time * 0.035 + uv.y * 3.0) * 0.006 * depth * motion;
  uv = clamp(uv, 0.001, 0.999);
  vec3 color = texture2D(earth, uv).rgb;
  float city = smoothstep(0.06, 0.40, color.r - color.b) * smoothstep(0.25, 0.75, color.r);
  color += vec3(1.0, 0.56, 0.18) * city * (sin(time * 0.7 + uv.x * 90.0 + uv.y * 55.0) * 0.5 + 0.5) * 0.045 * motion;
  vec2 sun = vec2(0.67, 0.81);
  vec2 delta = (uv - sun) * vec2(imageRatio, 1.0);
  float halo = exp(-length(delta) * 19.0);
  float streak = exp(-abs(delta.y + delta.x * 0.22) * 260.0) * exp(-abs(delta.x) * 9.0);
  float breath = 0.86 + sin(time * 0.23) * 0.14 * motion;
  color += vec3(1.0, 0.64, 0.30) * (halo * 0.06 + streak * 0.045) * breath;
  vec2 cell = floor(uv * vec2(400.0, 600.0));
  float star = step(0.9988, hash(cell));
  float sky = (1.0 - smoothstep(0.04, 0.16, dot(color, vec3(0.2126, 0.7152, 0.0722)))) * smoothstep(0.78, 0.95, uv.y);
  color += vec3(0.58, 0.76, 1.0) * star * sky * (0.2 + 0.18 * sin(time * 0.8 + hash(cell) * 60.0)) * motion;
  gl_FragColor = vec4(color, 1.0);
}`;

export function OrbitalScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: true });
    if (!gl) return;
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) { gl!.deleteShader(shader); return null; }
      return shader;
    }
    const vs = compile(gl.VERTEX_SHADER, vertex);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      if (program) gl.deleteProgram(program);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const uniforms = {
      time: gl.getUniformLocation(program, 'time'), resolution: gl.getUniformLocation(program, 'resolution'),
      pointer: gl.getUniformLocation(program, 'pointer'), imageSize: gl.getUniformLocation(program, 'imageSize'),
      motion: gl.getUniformLocation(program, 'motion'),
    };
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0, lastFrame = 0, elapsed = 0;
    let loaded = false, disposed = false;
    function resize() {
      const width = canvas!.clientWidth, height = canvas!.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(uniforms.resolution, width, height);
    }
    function draw() {
      if (!loaded || disposed || gl!.isContextLost()) return;
      current.x += (target.x - current.x) * 0.04; current.y += (target.y - current.y) * 0.04;
      const moving = !reducedMotion.matches;
      gl!.uniform1f(uniforms.time, elapsed); gl!.uniform1f(uniforms.motion, moving ? 1 : 0);
      gl!.uniform2f(uniforms.pointer, moving ? current.x : 0, moving ? current.y : 0);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    // Cap at 30 fps and suspend the compositor in background tabs.
    function animate(now: number) {
      frame = 0;
      if (document.hidden || reducedMotion.matches || disposed) return;
      if (now - lastFrame >= 1000 / 30) { elapsed += Math.min((now - lastFrame) / 1000, 0.1); lastFrame = now; draw(); }
      frame = requestAnimationFrame(animate);
    }
    function resume() {
      cancelAnimationFrame(frame); frame = 0; draw(); lastFrame = performance.now();
      if (!document.hidden && !reducedMotion.matches && loaded) frame = requestAnimationFrame(animate);
    }
    function pointerMove(event: PointerEvent) {
      target.x = (event.clientX / innerWidth - 0.5) * 2; target.y = (0.5 - event.clientY / innerHeight) * 2;
    }
    function resetPointer() { target.x = 0; target.y = 0; }
    function onResize() { resize(); draw(); }
    function lost(event: Event) { event.preventDefault(); cancelAnimationFrame(frame); canvas!.dataset.ready = 'false'; }
    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.uniform2f(uniforms.imageSize, image.width, image.height);
      loaded = true; resize(); resume(); canvas.dataset.ready = 'true';
    };
    image.src = '/earth-orbit.webp';
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', pointerMove, { passive: true });
    document.addEventListener('pointerleave', resetPointer);
    document.addEventListener('visibilitychange', resume);
    reducedMotion.addEventListener('change', resume);
    canvas.addEventListener('webglcontextlost', lost);
    return () => {
      disposed = true; cancelAnimationFrame(frame); image.onload = null;
      window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', pointerMove);
      document.removeEventListener('pointerleave', resetPointer); document.removeEventListener('visibilitychange', resume);
      reducedMotion.removeEventListener('change', resume); canvas.removeEventListener('webglcontextlost', lost);
      gl.deleteBuffer(buffer); gl.deleteTexture(texture); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs);
    };
  }, []);
  return <div className="orbital-scene" aria-hidden="true"><canvas ref={canvasRef} className="orbital-canvas" /></div>;
}
