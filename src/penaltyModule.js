import * as THREE from 'three'
import gsap from 'gsap'

const BUTTON_IDLE = 0, BUTTON_KICK_DIRECTION = 2, BUTTON_KICK_POWER = 1, BUTTON_INACTIVE = -1
const ARROW_RIGHT = -1, ARROW_LEFT = 1
const POWER_DOWN = -1, POWER_UP = 1


export class Penalty {
  
    constructor(controls, scene, world) {
    this.controls = controls
    this.scene = scene
    this.world = world
    this.buttonState = BUTTON_IDLE
    this.penaltyButton = document.querySelector("#penalty")
    this.kickButton = document.querySelector("#kickButton")
    this.closeButton = document.querySelector("#closePenalty")
    this.objectNames = [ 
                            "BottleCap01", "BottleCap02", "BottleCap03", "BottleCap04",  "BottleCap05", "BottleCap06", 
                            "BottleCap07", "BottleCap08", "BottleCap09", "BottleCap10",  "BottleCap11", "BottleCap12", 
                          ]
    this.bottleNames = [ 
                            "BottlePlaneNtx", "BottlePlaneZn", "BottlePlaneKoz", "BottlePlaneStella", "BottlePlaneBrah", "BottlePlaneRf",
                            "BottlePlaneGg", "BottlePlaneBs", "BottlePlaneEssa", "BottlePlaneHg", "BottlePlaneLowe", "BottlePlaneAmster",
                        ]               
    this.defaultPos = []
    this.bottleGroups = []
    this.kick = {
        power: 0,
        direction: 0
    }
    this.powerTimeline = gsap.timeline()
    this.directionTimeline = gsap.timeline()
    this.moveGateKeeper = gsap.timeline()
    this.timeClicked = 0
  }

  init() {

    this.buttonState = BUTTON_KICK_DIRECTION
    

    this.timeClicked++

    this.moveCamera()

    

    let cameraRest = (event) => {
        this.world.getRigidBody(0).sleep()
        this.closeButton.style.visibility = "visible"
        this.kickButton.style.visibility = "visible"
        this.controls.removeEventListener("rest", cameraRest)
    }

    this.controls.addEventListener("rest", cameraRest)

    this.penaltyButton.style.visibility = "hidden"
    this.directionTimeline.restart()
    this.powerTimeline.time(0).kill()
    this.moveGateKeeper.restart()

    if (this.timeClicked <= 1) {
        this.setupButton()
        this.saveBottlePositions()
    }



  }

  moveCamera() {
    this.controls.restThreshold = 0.2
    this.controls.enabled = false
    this.controls.lookInDirectionOf(0, -10, -14, true)
    this.controls.moveTo(0, 2, -2, true)
    this.controls.dolly(16, true)
    this.world.getRigidBody(0).resetForces()
    this.world.getRigidBody(0).applyImpulse({ x: 0.9, y: 0.0, z: -1}, true)
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
        direction: -10,
    }, {
        direction: 10,
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
        this.controls.dolly(-5, true)
        this.world.getRigidBody(0).resetForces()
        this.world.getRigidBody(0).setTranslation({ x: 0.0, y: -1.2, z: 0.0 }, true)
        this.world.getRigidBody(0).sleep()
     }
    

    this.kickButton.addEventListener("click", (event) => {
      console.log("click on button")

         this.powerTimeline.pause()

        switch (this.buttonState) {

          case BUTTON_KICK_DIRECTION:
                this.directionTimeline.pause()
                this.powerTimeline.restart()
                this.buttonState = BUTTON_KICK_POWER
                break;

          case BUTTON_KICK_POWER:
                this.buttonState = BUTTON_INACTIVE
                this.powerTimeline.pause()
                this.kickButton.style.visibility = "hidden"
                this.controls.dolly(5, true)
                this.world.getRigidBody(0).resetForces()
                this.world.getRigidBody(0).setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true)
                this.world.getRigidBody(0).setAngvel({ x: 3.0, y: 3.0, z: -3.0 }, true)
                this.world.getRigidBody(0).applyImpulse({ x: this.kick.direction, y: this.kick.power, z: -this.kick.power }, true)
                break;
        }
        
    }, true)
  }

  saveBottlePositions() {

    let i = 0

    for (const objectName of this.objectNames) { 
        
        let capMesh = this.scene.getObjectByName(objectName)
        let bottlePlane = this.scene.getObjectByName(this.bottleNames[i])
        let newGroup = new THREE.Group()
        newGroup.add(capMesh)
        newGroup.add(bottlePlane)
        this.scene.add(newGroup)

        this.defaultPos.push(newGroup.position)
        this.bottleGroups.push(newGroup)

        bottlePlane.position.x = capMesh.position.x
        bottlePlane.position.z = capMesh.position.z

        i++
    }

   this.moveGateKeeper.fromTo(this.bottleGroups[11].position, {
        x: -3
    }, {
        x: 3,
        yoyo: true,
        repeat: -1,
        ease: "none",
        duration: 1
    }).restart()




  }


  update() {

  }

  stop() {

    this.moveGateKeeper.pause()
    //Set Button State
    this.buttonState = BUTTON_IDLE

    this.closeButton.style.visibility = "hidden"
    this.kickButton.style.visibility = "hidden"
    this.penaltyButton.style.visibility = "visible"

    this.world.getRigidBody(0).resetForces()
    this.world.getRigidBody(0).setTranslation({ x: 0.0, y: -1.2, z: 0.0 }, true)
    this.world.getRigidBody(0).sleep()

    this.controls.lookInDirectionOf(0, -100, 0, true)                
    this.controls.moveTo(0, 0, 0, true)
    this.controls.dolly(-20, true)

    this.controls.enabled = true 
    this.isCameraAnimating = false
  }



  }
