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
  const groundBaked = useLoader(THREE.TextureLoader, '/ground.jpg')
  groundBaked.channel = 1;
  groundBaked.flipY = false;
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

  nodes.ground.geometry.setAttribute('density', computeFlowerDensity(nodes.ground.geometry))
  const [hovered, set] = useState()

  return (
    <group {...props} dispose={null}>
      <mesh frustumCulled={false} geometry={nodes.bak.geometry} material={nodes.bak.material} >
        <meshPhysicalMaterial roughness={0} metalness={0.4} envMapIntensity={1} color={'#b57559'} />
      </mesh>

      <reflector frustumCulled={false} ref={ref} args={[nodes.water.geometry, config]} />

      <mesh frustumCulled={false} geometry={nodes['portal-frame'].geometry} material={nodes['portal-frame'].material}>
      </mesh>
      <mesh frustumCulled={false} receiveShadow geometry={nodes.Cylinder.geometry} material={nodes.Cylinder.material}>
        <meshStandardMaterial {...stencil} color={'#ffffff'} envMapIntensity={0.9} />
      </mesh>

      <Logo materials={materials} nodes={nodes} stencil={stencil} />

      <Mask frustumCulled={false} id={1} colorWrite={true} depthWrite={false}
        geometry={nodes.portal.geometry}
      >
        <meshBasicMaterial color={'#fe4409'} />
      </Mask>


      <Grass>
        <mesh frustumCulled={false} geometry={nodes.ground.geometry} material={nodes.ground.material}  >
          <meshBasicMaterial map={groundBaked} />
        </mesh>
      </Grass>

      <mesh frustumCulled={false} geometry={nodes.rocks.geometry} material={nodes.rocks.material} >
      <meshBasicMaterial map={groundBaked} />

      </mesh>


      <mesh frustumCulled={false} castShadow receiveShadow geometry={nodes.Object_2.geometry} material={materials.acacia_leaf}>
        <MeshDistortMaterial
          side={THREE.DoubleSide}
          factor={1.5}
          speed={0.5}
          map={bakedTexture} transparent alphaTest={0.2} depthWrite={false} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Object_3.geometry} material={materials.bark07} >
        <meshStandardMaterial color={'#2f1f15'} />
      </mesh>

      <mesh frustumCulled={false}
        castShadow receiveShadow geometry={nodes.Object_2001.geometry} material={materials.acacia_leaf}>
        <MeshDistortMaterial
          side={THREE.DoubleSide}
          factor={1.5}
          speed={0.5}
          map={bakedTexture} transparent alphaTest={0.2} depthWrite={false} />
      </mesh>
      <mesh frustumCulled={false} castShadow receiveShadow geometry={nodes.Object_3001.geometry} material={materials.bark07} >
        <meshStandardMaterial color={'#2f1f15'} />
      </mesh>


    </group>
  )
}

const Logo = ({ materials, nodes, stencil }) => {
  const [hovered, set] = useState()
  useCursor(hovered, /*'pointer', 'auto', document.body*/)

  return (
    <Float floatIntensity={1} floatingRange={[0, 0.5]} rotationIntensity={0.4} speed={2} >
      <mesh frustumCulled={false} onClick={() => {
        window.open('https://www.thebrinkagency.com/', '_blank')
      }} onPointerOver={() => set(true)} onPointerOut={() => set(false)} castShadow geometry={nodes.Curve.geometry} material={materials['SVGMat.001']} >
        <meshStandardMaterial roughness={0.2} {...stencil} color={'#000000'} />
      </mesh>
    </Float>
  )
}

useGLTF.preload('/isometric.glb')
