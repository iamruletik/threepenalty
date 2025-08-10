import { Clock } from 'three'

class Loop {
  constructor(camera, scene, renderer, world, debug) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.world = world
    this.updatables = []
    this.fpsGraph = debug
    this.clock = new Clock()
  }

  start() {


    this.renderer.setAnimationLoop(() => {
        this.fpsGraph.begin()

        //Clock
        let delta = this.clock.getDelta()

        //Update Camera
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        
        this.world.step(this.eventQueue) //Update Physics
        this.tick(delta) // Update All objects
        this.renderer.setSize(window.innerWidth, window.innerHeight) //Update Size Matrix
        this.renderer.render(this.scene, this.camera) // Render

        this.fpsGraph.end()
    })
  }

  stop() {
    this.renderer.setAnimationLoop(null)
  }

  tick(delta) {
    for (const object of this.updatables) {
        object.update(delta)
    }
  }
}

export { Loop }