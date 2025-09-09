import * as THREE from 'three'
import gsap from 'gsap'

const BUTTON_IDLE = "IDLE", 
      BUTTON_KICK_DIRECTION = "DIRECTION", 
      BUTTON_KICK_POWER = "KICK", 
      BUTTON_INACTIVE = "INACTIVE"

const goalSign = document.querySelector(".goal")
const missSign = document.querySelector(".miss")
const goalSignTimeline = gsap.timeline()
const missSignTimeline = gsap.timeline()

goalSignTimeline.set(goalSign, {autoAlpha: 0 })

goalSignTimeline.fromTo(goalSign, {
  autoAlpha: 0,
  onComplete: () => {
    goalSign.load()
    goalSign.play()
  }
}, {
  autoAlpha: 1,
  duration: 0.3,
  ease: "power2.inOut"
})
goalSignTimeline.to(goalSign, {
  autoAlpha: 0,
  delay: 1.5
}, ">").pause()


missSignTimeline.set(missSign, { autoAlpha: 0 })

missSignTimeline.fromTo(missSign, {
  autoAlpha: 0,
  onComplete: () => {
    missSign.load()
    missSign.play()
  }
}, {
  autoAlpha: 1,
  duration: 0.3,
  ease: "power2.inOut"
})
missSignTimeline.to(missSign, {
  autoAlpha: 0,
  delay: 1.5
}, ">").pause()

export class Penalty {
  
    constructor(camera, controls, scene, world) {
    this.controls = controls
    this.camera = camera
    this.scene = scene
    this.world = world
    this.buttonState = BUTTON_IDLE
    this.kickButton = document.querySelector("#kickButton")           
    this.kick = {
        power: 0,
        direction: 0
    }
    this.powerTimeline = gsap.timeline()
    this.directionTimeline = gsap.timeline()
    this.moveGateKeeper = gsap.timeline()
    this.timeClicked = 0
    this.isGoal = false
    this.isExiting = false
    this.isActive = false
    this.goalCount = 0
    this.goalCounter = document.querySelector(".goalCounterNumber")
    this.goalCounterContainer = document.querySelector("#goalCounter")
    this.gateKeeperPosition = null
  }

  start() {
    //Penalty Active
    this.isActive = true
    //Enable Button for Penalty
    this.setupButton()

  }

  init() {

    //Set State for a Button
    this.buttonState = BUTTON_KICK_DIRECTION

    //Reset Goal Text
    this.goalCounter.innerHTML = this.goalCount
    

    let cameraRest = (event) => {
        this.world.getRigidBody(0).sleep()
        this.goalCounterContainer.style.visibility = "visible"
        this.kickButton.style.visibility = "visible"
        this.controls.removeEventListener("rest", cameraRest)
    }

    this.controls.addEventListener("rest", cameraRest)

    this.directionTimeline.restart()
    this.powerTimeline.time(0).kill()
    this.moveGateKeeper.restart()

  }


  goal() {
    this.isGoal = true
    this.goalCount++
    this.goalCounter.innerHTML = this.goalCount

    setTimeout(() => {
      this.stop()
      this.init()
      goalSignTimeline.restart()
    }, 1000)

  }

  setupButton() {

    
    this.kick.power = 0
    this.powerTimeline.pause()

    this.powerTimeline.to(this.kick, {
        power: 10,
        yoyo: true,
        repeat: -1,
        duration: 1,
        ease: "none",
        onUpdate: () => {
        }
    })
    this.powerTimeline.fromTo("#powerGradient", {
        "--clip": '5%',
    }, {
        "--clip": '55%',
        yoyo: true,
        repeat: -1,
        duration: 1,
        ease: "none"
    }, "<")

    this.directionTimeline.fromTo(this.kick, {
        direction: -7,
    }, {
        direction: 7,
        yoyo: true,
        repeat: -1,
        duration: 1,
        ease: "none",
        onUpdate: () => {
          //console.log(this.kick.direction)
        }
    })
     this.directionTimeline.to("#arrow-container", {
      rotation: 90,
      transformOrigin: "center center",
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: "none",
     }, "<")


     let resetTimer = (event) => {
        console.log("reset Timer fired")
        console.log(this.isGoal)
        console.log(this.isExiting)
        if (!this.isGoal && !this.isExiting) {
          this.stop()
          this.init()
          missSignTimeline.restart()
          //console.log("TIME RESET " + this.isGoal)
        } else if (this.isGoal) {
          this.isGoal = false
        } else if (this.isExiting) {
          this.isExiting = false
        }
     }
    

    this.kickButton.addEventListener("click", (event) => {
        console.log(this.buttonState)

         this.powerTimeline.pause()

        switch (this.buttonState) {

          case BUTTON_KICK_DIRECTION:
                this.directionTimeline.pause()
                this.powerTimeline.restart()
                this.buttonState = BUTTON_KICK_POWER
                break;

          case BUTTON_KICK_POWER:
                setTimeout(resetTimer, 4000)
                this.buttonState = BUTTON_INACTIVE
                this.powerTimeline.pause()
                this.kickButton.style.visibility = "hidden"
                this.controls.dolly(4, true)
                this.world.getRigidBody(0).resetForces()
                this.world.getRigidBody(0).setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true)
                this.world.getRigidBody(0).setAngvel({ x: 3.0, y: 3.0, z: -3.0 }, true)
                this.world.getRigidBody(0).applyImpulse({ x: this.kick.direction, y: this.kick.power, z: -this.kick.power }, true)
                break;
        }
        
    }, true)
  }



  update() {

  }

  stop() {

    this.isActive = false

    this.moveGateKeeper.pause()
    //Set Button State
    this.buttonState = BUTTON_IDLE

    this.goalCounter.innerHTML = this.goalCount



    this.kickButton.style.visibility = "hidden"
    this.goalCounterContainer.style.visibility = "hidden"

    this.world.getRigidBody(0).resetForces()
    this.world.getRigidBody(0).setTranslation({ x: 0.0, y: -1.2, z: 0.0 }, true)
    this.world.getRigidBody(0).sleep()

    let distance = this.camera.position.distanceTo(new THREE.Vector3(0,0,0)) - 8
    //console.log(distance)

    this.controls.lookInDirectionOf(0, -100, -10, true)                
    this.controls.moveTo(0, 0, 0, true)
    this.controls.dolly(distance, true)

    this.controls.enabled = true 
    this.isCameraAnimating = false
  }



  }
