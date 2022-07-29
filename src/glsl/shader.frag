precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec3 pointer;

#pragma glslify: raymarch = require('./iquilezles-raymarch.glsl')

void main() {
  vec2 p = pointer.xy / resolution;
  raymarch(gl_FragColor, gl_FragCoord.xy, resolution, time * 0.1);
}