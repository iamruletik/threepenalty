import RAPIER from '@dimforge/rapier3d'

export class ColliderCreator {

  constructor(scene, world) {
    this.scene = scene
    this.world = world
    this.collidersList = []
  }

  create(objectNameArray) {
    for (const objectName of objectNameArray) { 
        let tempMesh = this.scene.getObjectByName(objectName)
        //console.log(objectName)
        let newCollider = RAPIER.ColliderDesc.convexHull(tempMesh.geometry.attributes.position.array)
        newCollider.setTranslation(tempMesh.position.x, tempMesh.position.y, tempMesh.position.z)
        let realCollider = this.world.createCollider(newCollider)

        /*
        if(objectName == "BottleCap12") {
          this.collidersList.push(realCollider)
        } */
        
    }

    return this.collidersList

  }

}
