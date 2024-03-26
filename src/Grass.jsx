import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import { Sampler, shaderMaterial, useTexture } from '@react-three/drei'
import Perlin from 'perlin.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import WindLayer from './WindLayer'
import WindLayerTall from './WindLayerTall'

Perlin.seed(Math.random())
import { Depth, LayerMaterial } from 'lamina'
import { Flower } from './Flower'
import useSound from 'use-sound'

extend({ WindLayer })
extend({ WindLayerTall })



export function Grass({ children, strands = 9000, ...props }) {
    const alpha = useTexture('/alpha.jpg');
    const meshRef = useRef(null)
    const meshTallRef = useRef(null)
    const flowerRef = useRef()
    const windLayer = useRef(null)
    const windLayerTall = useRef(null)
    const mousePosition = useRef(new THREE.Vector3())

    useFrame((state, delta) => {
        windLayer.current.time += delta * 0.5
        if (mousePosition.current.x !== 0) {
            windLayer.current.mouse = windLayer.current.mouse.lerp(mousePosition.current, delta * 5)
        } else {
            windLayer.current.mouse = windLayer.current.mouse.lerp(new THREE.Vector3(0, 0, 0), delta * 2)
        }
        windLayerTall.current.time += delta * 0.5
        if (mousePosition.current.x !== 0) {
            windLayerTall.current.mouse = windLayerTall.current.mouse.lerp(mousePosition.current, delta * 5)
        } else {
            windLayerTall.current.mouse = windLayerTall.current.mouse.lerp(new THREE.Vector3(0, 0, 0), delta * 2)
        }
    })


    useEffect(() => {
        meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.2))
        meshTallRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        meshTallRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.2))
        flowerRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        flowerRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))
    }, [])

    const geomRef = useRef()

    const transform = useCallback(({ position, normal, dummy: object }) => {
        const p = position.clone().multiplyScalar(5);
        const n = Perlin.simplex3(...p.toArray());
        object.scale.setScalar(THREE.MathUtils.mapLinear(n, -1, 1, 0.6, 1.1) * 0.5);

        object.position.copy(position);
        object.lookAt(normal.add(position));
        object.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5);
        object.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5);
        object.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5);
        object.updateMatrix();
        return object;
    }, []);

    const transformTall = useCallback(({ position, normal, dummy: object }) => {
        const p = position.clone().multiplyScalar(5)
        const n = Perlin.simplex3(...p.toArray())
        object.scale.setScalar(THREE.MathUtils.mapLinear(n, -1, 1, 0.6, 1.1) * 0.5)

        object.position.copy(position)
        object.lookAt(normal.add(position))
        object.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5)
        object.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
        object.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
        object.updateMatrix()
        return object
    }, []);

    const transformFlower = useCallback(({ position, normal, dummy: object }) => {
        object.scale.setScalar((Math.random() * 0.5 + 0.5) * 0.1)
        object.position.copy(position)
        object.lookAt(normal.add(position))
        object.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5)
        object.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
        object.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
        object.updateMatrix()
        return object
    }, []);

    // onMouseMove event children
    return (
        <>
            {React.cloneElement(children, {
                ref: geomRef,
                onPointerMove: (e) => {

                    mousePosition.current = e.point

                },
                onPointerLeave: () => mousePosition.current = new THREE.Vector3(0, 0, 0),
                // onPointerEnter: (e) => mousePosition.current = e.point,
            })}
            <instancedMesh frustumCulled={false} receiveShadow ref={meshRef} args={[undefined, undefined, strands]} {...props}>
                <planeGeometry args={[0.035, 0.4, 2, 20, false, 0, Math.PI]} />
                <LayerMaterial
                    alphaTest={0.4}
                    alphaMap={alpha}
                    side={THREE.DoubleSide} lighting="standard" envMapIntensity={1}>
                    <Depth colorA="#220c00" colorB="#ca4713" near={0.07} far={1} mapping={'world'} />
                    <windLayer
                        args={[{ mode: 'multiply' }]}
                        colorA={'#ffffff'}
                        colorB={'#d0310e'}
                        noiseScale={10}
                        noiseStrength={5}
                        length={2.2}
                        sway={1.2}
                        ref={windLayer}
                    />
                </LayerMaterial>
            </instancedMesh>
            <instancedMesh frustumCulled={false} receiveShadow ref={meshTallRef} args={[undefined, undefined, 2000]} {...props}>
                <planeGeometry args={[0.035, 1, 2, 20, false, 0, Math.PI]} />
                <LayerMaterial
                    alphaTest={0.4}
                    alphaMap={alpha}
                    side={THREE.DoubleSide} lighting="standard" envMapIntensity={1}>
                    <Depth colorA="#220c00" colorB="#ca4713" near={0.07} far={1} mapping={'world'} />
                    <windLayerTall
                        args={[{ mode: 'multiply' }]}
                        colorA={'#ffffff'}
                        colorB={'#d0310e'}
                        noiseScale={10}
                        noiseStrength={5}
                        length={2.2}
                        sway={1.2}
                        ref={windLayerTall}
                    />
                </LayerMaterial>
            </instancedMesh>
            <Flower ref={flowerRef} />
            <group>
                <Sampler
                    count={strands}
                    transform={transform}
                    mesh={geomRef}
                    instances={meshRef}
                />
                <Sampler
                    count={2000}
                    transform={transformTall}
                    mesh={geomRef}
                    instances={meshTallRef}
                    weight='color'
                />
                <Sampler
                    count={10}
                    transform={transformFlower}
                    mesh={geomRef}
                    instances={flowerRef}
                    weight="color"
                />
            </group>

        </>
    )
}

export const MemoizedGrass = React.memo(Grass);
