const BUTTON_IDLE = 0, BUTTON_KICK_DIRECTION = 1, BUTTON_KICK_POWER = 2, BUTTON_INACTIVE = -1
const ARROW_RIGHT = -1, ARROW_LEFT = 1
const POWER_DOWN = -1, POWER_UP = 1


export class Penalty {
  
    constructor(controls, scene, world) {
    this.controls = controls
    this.scene = scene
    this.world = world
    this.buttonState = BUTTON_IDLE
    this.kickButton = document.querySelector("#kickButton")
  }

  init() {

    this.moveCamera()

    this.setupButton()

    //moveBottles()

    //resetBall()

    //animateGateKeeper()

    //eventListeners()


  }

  moveCamera() {
    this.controls.enabled = false
    this.controls.lookInDirectionOf(0, -10, -16, true)
    this.controls.moveTo(0, 2, -2, true)
    this.controls.dolly(16, true)
  }

  setupButton() {
    kickButton.addEventListener("click", (event) => {
        if (this.buttonState == BUTTON_IDLE) {
            this.buttonState = BUTTON_KICK_DIRECTION
        } else if (this.buttonState == BUTTON_KICK_DIRECTION) {
            this.buttonState = BUTTON_KICK_POWER
        } else if (this.buttonState == BUTTON_KICK_POWER) {
            this.buttonState = BUTTON_INACTIVE
            this.world.getRigidBody(0).resetForces()
            this.world.getRigidBody(0).setTranslation({ x: 0.0, y: 0.3, z: 0.0 }, true)
            this.world.getRigidBody(0).setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true)
            this.world.getRigidBody(0).setAngvel({ x: 3.0, y: 3.0, z: -3.0 }, true)
            //world.getRigidBody(0).addForce({ x: ((Math.random()-0.5)*20), y: 6.0, z: (-Math.random()*20) }, true)
            this.world.getRigidBody(0).applyImpulse({ x: 10, y: 0.0, z: -8 }, true)
        }
    }, true)
  }


  update() {

  }

  stop() {

    this.controls.lookInDirectionOf(0, -100, 0, true)                
    this.controls.moveTo(0, 0, 0, true)
    this.controls.dolly(-18, true)

    this.controls.enabled = true 
    this.isCameraAnimating = false
  }



  }