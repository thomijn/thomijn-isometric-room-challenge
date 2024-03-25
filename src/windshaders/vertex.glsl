uniform float time;
uniform sampler2D perlinTexture;

varying vec2 vUv;


vec2 rotate2D(vec2 value, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}


void main() {

    vec3 newPosition = position;

    // float twistNoise = texture2D(perlinTexture, vec2(0.5,uv.y * 0.2 - time * 0.005)).r;

    // float angle = twistNoise * 10.0;
    // newPosition.xz = rotate2D(newPosition.xz, angle);

    // vec2 windOffset = vec2(
    //   texture2D(perlinTexture, vec2(0.25, time * 0.01)).r - 0.5,
    //   texture2D(perlinTexture, vec2(0.75, time * 0.01)).r - 0.5
    // );
    // newPosition.xz += windOffset *= pow(uv.y, 2.) * 10.;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;

}
