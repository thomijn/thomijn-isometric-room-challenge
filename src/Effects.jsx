import { Autofocus, DepthOfField, EffectComposer, N8AO, ToneMapping, Vignette } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { BlendFunction } from 'postprocessing'
const Effects = () => {
    const {focusDistance, focalLength, bokehScale} = useControls({
        focusDistance: {value: 0.75, min: 0, max: 1},
        focalLength: {value: 0.3, min: 0, max: 1},
        bokehScale: {value: 20, min: 0, max: 100}
    })
    return (
        <EffectComposer
            stencilBuffer={true}
        >
            <DepthOfField
                focusDistance={focusDistance}
                focalLength={focalLength}
                bokehScale={bokehScale}
                height={480}
                // blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    )
}

export default Effects