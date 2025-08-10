import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { ColliderCreator } from './colliderCreator.js'
import RAPIER from '@dimforge/rapier3d'

export class SoccerScene {

  constructor(scene, world) {
    this.pathToGLTFScene = '/SoccerFieldNew/SoccerFieldNew.gltf'
    this.soccerField = null
    this.soccerFieldObjectName = "SoccerField"
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

  load() {

    let colliderCreator = new ColliderCreator(this.scene, this.world)




   //Load Soccer Field
    this.gltfLoader.load(this.pathToGLTFScene, (gltf) => {

        //Iterate through all objects from GLTF file and add them to the provided scene
        const children = [...gltf.scene.children]
        for (const child of children) { this.scene.add(child) }

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


        //Load the Colliders
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

  }

}