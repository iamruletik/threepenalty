import gsap from 'gsap'

const BUTTON_IDLE = "IDLE", 
      BUTTON_KICK_DIRECTION = "DIRECTION", 
      BUTTON_KICK_POWER = "KICK", 
      BUTTON_INACTIVE = "INACTIVE"

const GOAL = 1,
      EMPTY = 0,
      MISS = -1


export class Penalty {
  
    constructor(camera, controls, scene, world) {
    this.controls = controls
    this.camera = camera
    this.scene = scene
    this.world = world
    
    this.isGoal = false
    this.goalCount = 0

    this.scoreboard = [0,0,0]
    this.kickCounter = 0
    this.scoreImg = null

    this.buttonState = BUTTON_IDLE
    this.kick = { 
                      power: 0, 
                      direction: 0 
                  }
    this.kickButton = document.querySelector("#kickButton")           
    this.powerTimeline = gsap.timeline()
    this.directionTimeline = gsap.timeline()

    this.goalSign = document.querySelector(".goal")
    this.missSign = document.querySelector(".miss")
    this.goalSignTimeline = gsap.timeline()
    this.missSignTimeline = gsap.timeline()

    this.scoreBoardElements = document.querySelectorAll(".scoreBoardLightImg")


  }

  start() {

    //Set goals to 0
    this.scoreboard = [0,0,0]
    this.kickCounter = 0

    //Set State Direction for a Button
    this.buttonState = BUTTON_KICK_DIRECTION

    //Enable Button for Penalty
    this.setupButton()

    //Create Goal&Miss Signs Timelines
    this.setupSigns()

    //Ball Sleep
    this.world.getRigidBody(0).sleep()

    //Show Kick Button
    this.kickButton.style.visibility = "visible"

  }


  setupSigns() {

    //Goal Animation
    this.goalSignTimeline.set(this.goalSign, {autoAlpha: 0 })

    this.goalSignTimeline.fromTo(this.goalSign, {
      autoAlpha: 0,
      onComplete: () => {
          this.goalSign.load()
          this.goalSign.play()
      }
    }, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "power2.inOut"
    })

    this.goalSignTimeline.to(this.goalSign, {
      autoAlpha: 0,
      delay: 1.5,
      onComplete: () => {
        //Show Button After Videos
        this.kickButton.style.visibility = "visible"
      }
    }, ">").pause()

    //Miss Animation
    this.missSignTimeline.set(this.missSign, { autoAlpha: 0 })

    this.missSignTimeline.fromTo(this.missSign, {
      autoAlpha: 0,
      onComplete: () => {
        this.missSign.load()
        this.missSign.play()
      }
    }, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "power2.inOut"
    })

    this.missSignTimeline.to(this.missSign, {
      autoAlpha: 0,
      delay: 1.5,
      onComplete: () => {
        //Show Button After Videos
        this.kickButton.style.visibility = "visible"
      }
    }, ">").pause()


  }

  //Goal Function
  goal() {

    this.isGoal = true

    this.scoreboard[this.kickCounter] = GOAL

    //Reset Scene & Play Animation after goal
    setTimeout(() => {
          this.reset()
          this.goalSignTimeline.restart()
    }, 1000)

  }


  //Setup Button
  setupButton() {

    //Reset Power of Kick
    this.kick.power = 0

    //Power Animation Timeline
    this.powerTimeline.pause()
    this.powerTimeline.to(this.kick, {
        power: 10,
        yoyo: true,
        repeat: -1,
        duration: 1,
        ease: "none",
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

    //Direction Animation
    this.directionTimeline.fromTo(this.kick, {
        direction: -7,
    }, {
        direction: 7,
        yoyo: true,
        repeat: -1,
        duration: 1,
        ease: "none",
    })
     this.directionTimeline.to("#arrow-container", {
      rotation: 90,
      transformOrigin: "center center",
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: "none",
     }, "<")



     //Reset Timer
     let resetTimer = (event) => {
        if (!this.isGoal) {
          this.scoreboard[this.kickCounter] = MISS
          this.reset()
          this.missSignTimeline.restart()
        } else if (this.isGoal) {
          this.isGoal = false
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


  //Reset Scene
  reset() {

    console.log(this.scoreboard[this.kickCounter])
    //Change Image on ScoreBoard
    if (this.scoreboard[this.kickCounter] == GOAL) {
      this.scoreImg = "/scoreBoardGoal.png"
    } else if (this.scoreboard[this.kickCounter] == MISS) {
      this.scoreImg = "/scoreBoardMiss.png"
    }

    this.scoreBoardElements[this.kickCounter].src = this.scoreImg

    //Count Kicks
    this.kickCounter++
    console.log(this.kickCounter)

    //Reset Camera
    this.controls.dolly(-4, true)

    //Reset Animations for Button
    this.directionTimeline.restart()
    this.powerTimeline.time(0).kill()

    //Set Button State
    this.buttonState = BUTTON_KICK_DIRECTION

    //Reset Ball State and put to Sleep
    this.world.getRigidBody(0).resetForces()
    this.world.getRigidBody(0).setTranslation({ x: 0.75, y: -1.2, z: -2.1 }, true)
    this.world.getRigidBody(0).sleep()

  }


  update() {

  }



  }
