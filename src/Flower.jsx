import { useGLTF, useTexture } from '@react-three/drei'
import { Depth, LayerMaterial, Texture } from 'lamina'
import { forwardRef } from 'react'
import { DoubleSide } from 'three'

export const Flower = forwardRef((props, ref) => {
  const { nodes } = useGLTF('/flower.glb')
  const map = useTexture('/textures/color.jpg')
  const ao = useTexture('/textures/ao.jpg')

  return (
    <instancedMesh
      frustumCulled={false}
      ref={ref}
      args={[undefined, undefined, 10]}
      castShadow
      receiveShadow
      geometry={nodes._ndyj_Var10_LOD0.geometry}
      {...props}>
      <LayerMaterial lighting="standard" envMapIntensity={0.5} side={DoubleSide}>
        {/* <Texture map={map} /> */}
        <Depth colorA="#220c00" colorB="#ff4400" near={0.05} far={1} mapping={'world'} />

        <Texture map={ao} mode="multiply" />
      </LayerMaterial>
    </instancedMesh>
  )
})
