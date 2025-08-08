import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { ColliderCreator } from './colliderCreator.js'
import RAPIER from '@dimforge/rapier3d'

export class SoccerScene {

  constructor(scene, world) {
    this.pathToGLTFScene = '/SoccerFieldNew/SoccerFieldNew.gltf'
    this.pathToGLTFBall = '/SoccerBall/soccerBall.gltf'
    this.soccerBall = null
    this.soccerBallObjectName = "SoccerBall"
    this.soccerField = null
    this.soccerFieldObjectName = "SoccerField"
    this.ballDownloaded = false
    this.gltfLoader = new GLTFLoader()
    this.scene = scene
    this.world = world
    this.objectNames = [ 
                            "BottleCap01", "BottleCap02", "BottleCap03", "BottleCap04",  "BottleCap05", "BottleCap06", 
                            "BottleCap07", "BottleCap08", "BottleCap09", "BottleCap10",  "BottleCap11", "BottleCap12", 
                            "BottlePlaneNtx", "BottlePlaneZn", "BottlePlaneKoz", "BottlePlaneStella", "BottlePlaneBrah", "BottlePlaneRf",
                            "BottlePlaneGg", "BottlePlaneBs", "BottlePlaneEssa", "BottlePlaneHg", "BottlePlaneLowe", "BottlePlaneAmster",
                          ]
  }

  loadSceneMesh() {

    let colliderCreator = new ColliderCreator(this.scene, this.world)

    //Load the Ball
    this.gltfLoader.load(this.pathToGLTFBall, (gltf) => {
      
        //Iterate through all objects from GLTF file and add them to the provided scene
        const children = [...gltf.scene.children]
        console.log(children)
        this.scene.add(children[0])
        for (const child of children[0].children) { 
          child.castShadow = true
          
        }

        //Look for SoccerBall Object and set it to castshadow and change bool to indicate that ball was dowbloaded
        this.soccerBall = this.scene.getObjectByName(this.soccerBallObjectName)
        this.soccerBall.castShadow = true 
        this.ballDownloaded = true 
    })


   //Load Soccer Field
    this.gltfLoader.load(this.pathToGLTFScene, (gltf) => {

        //Iterate through all objects from GLTF file and add them to the provided scene
        const children = [...gltf.scene.children]
        for (const child of children) { 
          this.scene.add(child) 
          child.castShadow = true
        }

        //Set Shadow for Soccer Field Outer
        let soccerFieldOuter = this.scene.getObjectByName("SoccerFieldOuter")
        soccerFieldOuter.receiveShadow = true

        //Find Soccer Field Object and set it to recieve shadows
        this.soccerField = this.scene.getObjectByName(this.soccerFieldObjectName)
        this.soccerField.receiveShadow = true
        this.soccerField.castShadow = false

        //Create Convex Hull Colliders for Specific Objects in the Scene
        colliderCreator.create(this.objectNames)


    })


        //Load the Ball
    this.gltfLoader.load("/SoccerFieldNew/SoccerFieldColliders.gltf", (gltf) => {
      
        //Iterate through all objects from GLTF file and add them to the provided scene
        const children = [...gltf.scene.children]
        for (const child of children) { 

          if (child.name != "SensorGate") {
              let newCollider = RAPIER.ColliderDesc.convexHull(child.geometry.attributes.position.array)
              newCollider.setTranslation(child.position.x, child.position.y, child.position.z)
              this.world.createCollider(newCollider)
          } else {
              let newCollider = RAPIER.ColliderDesc.convexHull(child.geometry.attributes.position.array)
              newCollider.setSensor(true)
              newCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
              newCollider.setTranslation(child.position.x, child.position.y, child.position.z)
              this.world.createCollider(newCollider)
          }

        }
    })
    
  }

  update() {

    //You Can find specific RigidBody by its handle
    let soccerBallRigidBody = this.world.getRigidBody(0)

    if (this.ballDownloaded) {
        this.soccerBall.position.copy(soccerBallRigidBody.translation())
        this.soccerBall.setRotationFromQuaternion(soccerBallRigidBody.rotation())
    }

  }

}