import { shaderMaterial, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import fragmentShader from './windshaders/fragment.glsl';
import vertexShader from './windshaders/vertex.glsl';
import * as THREE from 'three';
const CustomShader = shaderMaterial(
    {
        time: 0,
        speed: 0.5,
        perlinTexture: null,
    },
    vertexShader,
    fragmentShader
);

extend({ CustomShader })

const WindEffect = () => {
    const materialRef = useRef();
    const perlin = useTexture('/perlin.png');

    perlin.wrapS = perlin.wrapT = THREE.RepeatWrapping;

    useFrame((state, delta) => {
        materialRef.current.uniforms.time.value += delta;
        materialRef.current.uniforms.perlinTexture.value = perlin;
    });
    return (
        <mesh>
            <planeGeometry args={[10, 10, 128, 128]} />
            <customShader
                ref={materialRef}
                depthWrite={false}
                side={THREE.DoubleSide}
                transparent
            />
        </mesh>
    )
}

export default WindEffect