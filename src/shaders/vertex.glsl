
		uniform mat4 textureMatrix;
		varying vec4 vUv;
        uniform sampler2D tDudv;
        uniform float time;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );


            float waveStrength = 0.05;
            float waveSpeed = 0.5;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}