import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js'
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js'
import RAPIER from '@dimforge/rapier3d'
import { Penalty } from './penaltyModule'

class Loop {
  constructor(camera, scene, renderer, world, debug, penalty) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.world = world
    this.updatables = []
    this.fpsGraph = debug
    this.clock = new THREE.Clock()
    this.composer = new EffectComposer(renderer)
    this.renderScene = new RenderPass(scene, camera)
    this.eventQueue = new RAPIER.EventQueue(true)
    this.penalty = penalty
  }

  start() {

    const params = {
				threshold: 0.5,
				strength: 0.3,
				radius: 0.4,
				exposure: 0
    }

    const smaaPass = new SMAAPass()
    smaaPass.enabled = true

    const fxaaPass = new FXAAPass()

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
    bloomPass.threshold = params.threshold
    bloomPass.strength = params.strength
    bloomPass.radius = params.radius

    const outputPass = new OutputPass()
    this.composer.addPass( this.renderScene )
    //this.composer.addPass( fxaaPass )
    this.composer.addPass( bloomPass )
    this.composer.addPass( outputPass )


    // hardware (MSAA) antialiasing with postprocessing
    if ( this.renderer.getContext() instanceof WebGL2RenderingContext ) {
        this.composer.renderTarget1.samples = 16;
        this.composer.renderTarget2.samples = 16;
    }
    



    this.renderer.setAnimationLoop(() => {
        this.fpsGraph.begin()

        this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
          if (started) {
            this.penalty.goal()
            console.log("COLLISION DETECTED")
          }          
        });
        
        //Clock
        let delta = this.clock.getDelta()

        //Update Camera
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        
        this.world.step(this.eventQueue) //Update Physics
        this.tick(delta) // Update All objects
        this.renderer.setSize(window.innerWidth, window.innerHeight) //Update Size Matrix
        this.composer.setSize(window.innerWidth, window.innerHeight) //Update Size Matrix
        //this.renderer.render(this.scene, this.camera) // Render
        this.composer.render()

        this.fpsGraph.end()
    })
  }

  stop() {
    this.renderer.clear()
    this.renderer.setAnimationLoop(null)
  }

  tick(delta) {
    for (const object of this.updatables) {
        object.update(delta)
    }
  }
}

export { Loop }