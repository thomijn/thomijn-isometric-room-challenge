
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;
        uniform sampler2D tDudv;
        uniform float time;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

            float waveStrength = 0.07;
            float waveSpeed = 0.02;
            
            vec4 newUv = vUv;
            newUv.x *= 0.7;
            newUv.y *= 0.7;

            vec2 distortedUv = texture2D( tDudv, vec2( newUv.x + time * waveSpeed, newUv.y ) ).rg * waveStrength;
            distortedUv = newUv.xy + vec2( distortedUv.x, distortedUv.y + time * waveSpeed );
    	    vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 2.0 - 1.0 ) * waveStrength;


            vec4 uv = vec4( vUv );
            uv.xy += distortion;

            vec4 base = texture2DProj( tDiffuse, uv );
			gl_FragColor = vec4( mix( base.rgb, color, 0.8 ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}