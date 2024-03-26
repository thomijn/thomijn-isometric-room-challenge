/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 butterfly.glb --transform 
Files: butterfly.glb [927.5KB] > /Users/thomasgertenbach/Documents/isometric-room/public/butterfly-transformed.glb [38.48KB] (96%)
*/

import React, { useRef } from 'react'
import { useGLTF, PerspectiveCamera, useAnimations } from '@react-three/drei'

export function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/butterfly-transformed.glb')
  const { actions } = useAnimations(animations, group)
  return (
    <group ref={group} {...props} dispose={null}>
      <group>
        <primitive object={nodes.GLTF_created_0_rootJoint} />
        <PerspectiveCamera name="default_camera" makeDefault={false} far={1092.007} near={0.011} fov={45.837} position={[0.005, 0.006, 0.935]} />
        <skinnedMesh name="Object_7" geometry={nodes.Object_7.geometry} material={materials.M_BorboletaAzul} skeleton={nodes.Object_7.skeleton} position={[-0.06, 0, 0]} />
      </group>
    </group>
  )
}

useGLTF.preload('/butterfly-transformed.glb')