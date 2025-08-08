import RAPIER from '@dimforge/rapier3d'

export class ColliderCreator {

  constructor(scene, world) {
    this.scene = scene
    this.world = world
  }

  create(objectNameArray) {

    for (const objectName of objectNameArray) { 
        let tempMesh = this.scene.getObjectByName(objectName)
        let newCollider = RAPIER.ColliderDesc.convexHull(tempMesh.geometry.attributes.position.array)
        newCollider.setTranslation(tempMesh.position.x, tempMesh.position.y, tempMesh.position.z)
        this.world.createCollider(newCollider)
    }

  }

}
