import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import RAPIER from '@dimforge/rapier3d'

export class SoccerBall {

  constructor(scene, world) {
    this.scene = scene
    this.world = world
    this.soccerBall = null
    this.ballDownloaded = false
    this.pathToGLTFBall = '/SoccerBall/soccerBall.gltf'
    this.soccerBallObjectName = "SoccerBall"
    this.gltfLoader = new GLTFLoader()
    this.eventQueue = new RAPIER.EventQueue(true)
  }

  load() {
    //Load the Ball
    this.gltfLoader.load(this.pathToGLTFBall, (gltf) => {
        //Iterate through all objects from GLTF file and add them to the provided scene
        const children = [...gltf.scene.children]
        this.scene.add(children[0])
        for (const child of children[0].children) { child.castShadow = true }

        //Look for SoccerBall Object and set it to castshadow and change bool to indicate that ball was dowbloaded
        this.soccerBall = this.scene.getObjectByName(this.soccerBallObjectName)
        this.soccerBall.castShadow = true 
        this.ballDownloaded = true 

        // Create a dynamic rigid-body for a Ball
        let ballRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0.0, 1.0, 0.0)
            .setAdditionalMass(0.5)
        let ballRigidBody = this.world.createRigidBody(ballRigidBodyDesc)
        
        // Create a ball collider attached to the dynamic rigidBody.
        let ballColliderDesc = RAPIER.ColliderDesc.ball(0.55).setDensity(0.5)
        let ballCollider = this.world.createCollider(ballColliderDesc, ballRigidBody)
    })
  }

  update() {
    //You Can find specific RigidBody by its handle
    let soccerBallRigidBody = this.world.getRigidBody(0)

    if (this.ballDownloaded) {
        this.soccerBall.position.copy(soccerBallRigidBody.translation())
        this.soccerBall.setRotationFromQuaternion(soccerBallRigidBody.rotation())
    }

        //Handling Collision Events
        this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
            this.world.getRigidBody(0).sleep()
            this.world.getRigidBody(0).resetForces()
            this.world.getRigidBody(0).setTranslation({ x: 0.0, y: 0.3, z: 0.0 }, true)
            //buttonState = BUTTON_IDLE
        })
  }

}
