import { Canvas, } from "@react-three/fiber"
import { Environment, OrbitControls, SoftShadows, StatsGl } from "@react-three/drei"
import { Model } from "./Isometric"
import React from "react"
import { Butterfly } from "./ButterFly"
import { MathUtils } from "three"
import Effects  from "./Effects"
const rand = new Array(6).fill(0).map(() => ({
  position: [
    MathUtils.randFloat(2, 4),
    MathUtils.randFloat(0.5, 0.7),
    MathUtils.randFloat(0.5, 0.7)
  ],
  scale: MathUtils.randFloat(2, 3)
}))

function App() {

  return (
    <Canvas shadows orthographic camera={{
      position: [6, 3, 4],
      near: -2000,
      far: 1000,
      left: -25,
      right: 25,
      top: 25,
      bottom: -2500,
      zoom: 80,
    }}>
      {/* <color attach="background" args={["#e7b892"]} /> */}
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[2, 5, 3]} intensity={10} />
      <StatsGl />
      <Model />
      {rand.map((e, i) => (
        <Butterfly key={i} {...e} />
      ))}
      <OrbitControls rotation={[0, -Math.PI / 4, 0]} minPolarAngle={0} maxPolarAngle={Math.PI / 2} minAzimuthAngle={0} maxAzimuthAngle={Math.PI / 2} />
      <Environment preset="sunset" />
    </Canvas >
  )
}

export default App
