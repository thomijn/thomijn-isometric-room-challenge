uniform float time;
uniform sampler2D perlinTexture;

varying vec2 vUv;

void main() {
    vec2 smokeUv = vUv;
    smokeUv.x *= 4.5;
    smokeUv.y *= 0.1;

    smokeUv.y -= time * 0.1;

    float smoke = texture2D(perlinTexture, smokeUv).r;

    smoke = step(0.5, smoke);

    smoke = smoothstep(0.4, 1., smoke);
    //fade edges
    smoke *= smoothstep(0.0, .2, vUv.x);
    smoke *= smoothstep(0.0, .2, 1. - vUv.x);

    smoke *= smoothstep(0.0, .2, vUv.y);
    smoke *= smoothstep(0.0, .2, 1. - vUv.y);
    

    vec3 color = vec3(1.0, 0.0, 0.0);
 
    gl_FragColor = vec4(color, smoke);
}
