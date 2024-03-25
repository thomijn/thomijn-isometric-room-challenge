import { Canvas, } from "@react-three/fiber"
import { Environment, OrbitControls, SoftShadows, StatsGl, useProgress } from "@react-three/drei"
import { Model } from "./Isometric"
import React, { Suspense, useEffect, useRef, useState } from "react"
import { Butterfly } from "./ButterFly"
import { MathUtils } from "three"
import Effects from "./Effects"
import WindEffect from "./WindEffect"
import audioSfx from '/sound.mp3';
import { AnimatePresence, motion } from "framer-motion";

import useSound from "use-sound"
import gsap from "gsap"
const rand = new Array(6).fill(0).map(() => ({
  position: [
    MathUtils.randFloat(2, 4),
    MathUtils.randFloat(0.5, 0.7),
    MathUtils.randFloat(0.5, 0.7)
  ],
  scale: MathUtils.randFloat(2, 3)
}))

function App() {
  const [entered, setEntered] = useState(false);
  const { progress } = useProgress();
  const [play] = useSound(audioSfx, {
    volume: 0.4,
    loop: true
  });

  return (
    <>
      <AnimatePresence>
        {!entered && (
          <motion.div transition={{ duration: 1.2 }} exit={{ opacity: 0 }} className="intro">
            {/* <div className="progress-bar-wrapper">
              <motion.div
                className="progress-bar"
                initial={{ width: 0 }}
                animate={{
                  x: progress === 100 ? window.innerWidth * 0.31 : 0,
                  width: progress === 100 ? "100%" : progress + "%",
                }}
                transition={{
                  ease: [0.87, 0, 0.13, 1],
                  duration: 1,
                  x: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 1,
                  },
                }}
              ></motion.div>
            </div> */}
            <motion.button
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              onClick={() => {
                setEntered(true);
                play();
              }}
              initial={{ opacity: 0 }}
              transition={{
                delay: 1.5,
                duration: 0.4,
                ease: [0.87, 0, 0.13, 1],
              }}
              animate={{
                opacity: progress === 100 ? 1 : 0,
              }}
            >
              Enter
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <Suspense fallback={null}>
        <Canvas
          dpi={Math.min(2, window.devicePixelRatio)}
          shadows orthographic camera={{
            position: [6, 3, 4],
            near: -2000,
            far: 1000,
            left: -25,
            right: 25,
            top: 25,
            bottom: -2500,
            zoom: 90,
          }}>
          {/* <color attach="background" args={["#e7b892"]} /> */}
          <ambientLight intensity={0.5} />
          <directionalLight castShadow position={[4, 6, 3]} intensity={15} />
          <StatsGl />
          <Scene entered={entered} />
          <OrbitControls rotation={[0, -Math.PI / 4, 0]} minPolarAngle={0} maxPolarAngle={Math.PI / 2} minAzimuthAngle={0} maxAzimuthAngle={Math.PI / 2} />
          <Environment preset="sunset" />
          {/* <WindEffect /> */}
        </Canvas >
      </Suspense>
    </>
  )
}

const Scene = ({ entered }) => {
  const ref = useRef()

  useEffect(() => {
    if (entered) {
      gsap.to(ref.current.position, {
        y: 0,
        duration: 5,
        ease: "power4.inOut",
      })

      gsap.to(ref.current.rotation, {
        y: 0,
        duration: 5,
        ease: "power4.inOut",
      })
    }
  }, [entered])


  return (
    <group frustumCulled={false} position={[0, -13, 0]} rotation={[0,1,0]} ref={ref}>
      <Model />
      {rand.map((e, i) => (
        <Butterfly key={i} {...e} />
      ))}
    </group>
  )
}

export default App
