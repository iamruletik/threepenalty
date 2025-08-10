export class Penalty {
  constructor(camera, scene, renderer, world, debug) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.world = world
    this.updatables = []
    this.debug = debug
  }

  start() {
    //Button Kick

const BUTTON_IDLE = 0, BUTTON_KICK_DIRECTION = 1, BUTTON_KICK_POWER = 2, BUTTON_INACTIVE = -1
let button = playDebug.addButton({ title: "Kick Ball "})
let buttonState = BUTTON_IDLE

let arrowTexture = textureLoader.load('/arrow-texture.png')
let arrowAlphaTexture = textureLoader.load('/arrow-alpha.png')


//Direction Arrow
const ARROW_RIGHT = -1, ARROW_LEFT = 1
let arrowDirection = ARROW_LEFT
let directionArrowParent = new THREE.Group()
let directionArrow = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
        transparent: true,
        map: arrowTexture,
        alphaMap: arrowAlphaTexture
    })
)
directionArrow.position.set(0,1,-6)
directionArrow.rotation.x = -Math.PI * 0.5

directionArrowParent.position.set(0,0,2)

directionArrowParent.add(directionArrow)


const POWER_DOWN = -1, POWER_UP = 1
let powerDirection = POWER_UP
let powerBar = document.querySelector('.progressBar')
powerBar.value = 0

function animatePowerBar() {
    powerBar.style.display = "block"
    powerBar.value += (0.5 * powerDirection)
    if (powerBar.value >= 20) { powerDirection = POWER_DOWN } 
    if (powerBar.value <= 0) { powerDirection = POWER_UP }
    console.log(powerBar.value)
}


function animateDirectionArrow() {
    directionArrowParent.rotation.y += 0.02 * arrowDirection
    if (directionArrowParent.rotation.y >= 1) { arrowDirection = ARROW_RIGHT } 
    if (directionArrowParent.rotation.y <= -1) { arrowDirection = ARROW_LEFT }
}

button.on("click", (event) => {


        if (buttonState == BUTTON_IDLE) {
            buttonState = BUTTON_KICK_DIRECTION
        } else if (buttonState == BUTTON_KICK_DIRECTION) {
            buttonState = BUTTON_KICK_POWER
        } else if (buttonState == BUTTON_KICK_POWER) {
            buttonState = BUTTON_INACTIVE
            world.getRigidBody(0).resetForces()
            world.getRigidBody(0).setTranslation({ x: 0.0, y: 0.3, z: 0.0 }, true)
            world.getRigidBody(0).setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true)
            world.getRigidBody(0).setAngvel({ x: 3.0, y: 3.0, z: -3.0 }, true)
            //world.getRigidBody(0).addForce({ x: ((Math.random()-0.5)*20), y: 6.0, z: (-Math.random()*20) }, true)
            world.getRigidBody(0).applyImpulse({ x: (-directionArrowParent.rotation.y*10), y: 5.0, z: -powerBar.value-3 }, true)
        }

}, true)
  }

  update() {
        if (buttonState == BUTTON_KICK_DIRECTION) {
        scene.add(directionArrowParent)
        animateDirectionArrow()
    }

    if (buttonState == BUTTON_KICK_POWER) {
        animatePowerBar()
    }

    if (buttonState == BUTTON_INACTIVE) {
        powerBar.style.display = "none"
        scene.remove(directionArrowParent)
    }
  }

}