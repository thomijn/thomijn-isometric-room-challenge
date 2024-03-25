import React, { useMemo, useRef, useState } from 'react'
import { Environment, Float, Mask, MeshDistortMaterial, MeshPortalMaterial, MeshTransmissionMaterial, MeshWobbleMaterial, Sky, SoftShadows, shaderMaterial, useCursor, useGLTF, useMask, useTexture } from '@react-three/drei'

import { extend, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Grass } from './Grass';

import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

import { Water2, Reflector } from 'three-stdlib'
import Perlin from 'perlin.js'


extend({ Water2, Reflector })

const computeFlowerDensity = (geometry) => {
  const position = geometry.getAttribute('position')
  const density = []
  const vertex = new THREE.Vector3()
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i)
    const p = vertex.clone().multiplyScalar(1)
    const n = Perlin.simplex3(...p.toArray())
    let m = THREE.MathUtils.mapLinear(n, -1, 1, 0, 1)
    if (m > 0.15) m = 0
    density.push(m)
  }
  return new THREE.Float32BufferAttribute(density, 1)
}

export function Model(props) {
  const { nodes, materials } = useGLTF('/isometric.glb')

  const bakedTexture = useTexture('/leaves.png');
  bakedTexture.flipY = false;
  bakedTexture.channel = 0;

  const ref = useRef()
  const gl = useThree((state) => state.gl)
  const waterNormals = useLoader(THREE.TextureLoader, '/waternormals.jpeg')
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

  const customShader = Reflector.ReflectorShader
  customShader.fragmentShader = fragmentShader
  customShader.vertexShader = vertexShader
  //add uniform
  customShader.uniforms.tDudv = { value: waterNormals }
  customShader.uniforms.time = { value: 0 }

  const config = useMemo(
    () => ({
      shader: customShader,
      textureWidth: 256,
      textureHeight: 256,
      clipBias: 1,
      color: '#524437',
    }),
    [waterNormals]
  )


  const stencil = useMask(1, false)

  useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta))
  const geom = useMemo(() => new THREE.PlaneGeometry(10, 10), [])

  nodes.grass.geometry.setAttribute('density', computeFlowerDensity(nodes.grass.geometry))

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.bak.geometry} material={nodes.bak.material} >
        <meshPhysicalMaterial roughness={0} metalness={0.4} envMapIntensity={1} color={'#b57559'} />
      </mesh>

      <reflector ref={ref} args={[nodes.water.geometry, config]} />

      <mesh geometry={nodes['portal-frame'].geometry} material={nodes['portal-frame'].material}>
      </mesh>
      <mesh receiveShadow geometry={nodes.Cylinder.geometry} material={nodes.Cylinder.material}>
        <meshStandardMaterial {...stencil} color={'#ffffff'} envMapIntensity={0.9} />
      </mesh>

      <Logo materials={materials} nodes={nodes} stencil={stencil} />

      <Mask id={1} colorWrite={false} depthWrite={false}
        geometry={nodes.portal.geometry}
      >
      </Mask>


      <Grass>
        <mesh geometry={nodes.grass.geometry} material={nodes.grass.material} >
          <meshBasicMaterial color={'#3f2f26'} />
        </mesh>
      </Grass>

      <mesh castShadow receiveShadow geometry={nodes.Object_2.geometry} material={materials.acacia_leaf}>
        <MeshDistortMaterial
          side={THREE.DoubleSide}
          factor={1.5}
          speed={0.5}
          map={bakedTexture} transparent alphaTest={0.2} depthWrite={false} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Object_3.geometry} material={materials.bark07} >
        <meshStandardMaterial color={'#2f1f15'} />
      </mesh>

      <mesh
        castShadow receiveShadow geometry={nodes.Object_2001.geometry} material={materials.acacia_leaf}>
        <MeshDistortMaterial
          side={THREE.DoubleSide}
          factor={1.5}
          speed={0.5}
          map={bakedTexture} transparent alphaTest={0.2} depthWrite={false} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Object_3001.geometry} material={materials.bark07} >
        <meshStandardMaterial color={'#2f1f15'} />
      </mesh>


    </group>
  )
}

const Logo = ({ materials, nodes, stencil }) => {
  const [hovered, set] = useState()
  useCursor(hovered, /*'pointer', 'auto', document.body*/)

  return (
    <Float floatIntensity={1} floatingRange={[0, 0.5]} rotationIntensity={0.2} speed={2} >
      <mesh onClick={() => {
        window.open('https://www.thebrinkagency.com/', '_blank')
      }} onPointerOver={() => set(true)} onPointerOut={() => set(false)} castShadow geometry={nodes.Curve.geometry} material={materials['SVGMat.001']} >
        <meshStandardMaterial roughness={0.2} {...stencil} color={'#000000'} />
      </mesh>
    </Float>
  )
}

useGLTF.preload('/isometric.glb')
