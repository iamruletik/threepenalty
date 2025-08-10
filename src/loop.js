import { Clock } from 'three'

class Loop {
  constructor(camera, scene, renderer, world, debug) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.world = world
    this.updatables = []
    this.fpsGraph = debug
  }

  start() {


    this.renderer.setAnimationLoop(() => {
        this.fpsGraph.begin()

        //Update Camera
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        
        this.world.step(this.eventQueue) //Update Physics
        this.tick() // Update All objects
        this.renderer.setSize(window.innerWidth, window.innerHeight) //Update Size Matrix
        this.renderer.render(this.scene, this.camera) // Render

        this.fpsGraph.end()
    })
  }

  stop() {
    this.renderer.setAnimationLoop(null)
  }

  tick() {
    for (const object of this.updatables) {
        object.update()
    }
  }
}

export { Loop }