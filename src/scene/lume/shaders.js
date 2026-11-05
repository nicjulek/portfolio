export const bodyVert = `varying vec3 vN; varying vec3 vV;
void main(){ vec4 w = modelMatrix * vec4(position,1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`

export const bodyFrag = `uniform float uGlow; uniform float uHappy; varying vec3 vN; varying vec3 vV;
void main(){
  float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.0);
  vec3 core = vec3(1.0, 0.96, 0.82);
  vec3 rim = mix(vec3(1.0, 0.72, 0.32), vec3(1.0, 0.6, 0.7), uHappy);
  vec3 col = mix(core, rim, f) * (0.78 + uGlow * 0.3);
  gl_FragColor = vec4(col, 1.0);
}`

export const wingFrag = `uniform float uTime; uniform float uHappy; varying vec2 vUv;
vec3 hue(float h){ return clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); }
void main(){
  float d = length(vUv - vec2(0.15, 0.5));
  vec3 iri = hue(fract(d * 1.4 + uTime * 0.15 + uHappy * 0.3));
  vec3 col = mix(vec3(1.0, 0.98, 0.92), iri, 0.35);
  float vein = smoothstep(0.03, 0.0, abs(sin(atan(vUv.y - 0.5, vUv.x - 0.15) * 5.0)) * d);
  float a = 0.38 + vein * 0.3 + smoothstep(0.35, 0.8, d) * 0.25;
  gl_FragColor = vec4(col * 0.95, a);
}`
