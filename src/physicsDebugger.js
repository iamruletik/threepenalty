import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'

export class RapierDebugger {

  constructor(scene, world) {
    this.debugGeometry = new THREE.BufferGeometry()
    this.debugMaterial = new THREE.MeshBasicMaterial( { color: 0x00FFFF, wireframe: true } )
    this.debugMesh = new THREE.Mesh( this.debugGeometry, this.debugMaterial )
    this.scene = scene
    this.world = world
  }

  addDebugMesh() {
    this.scene.add(this.debugMesh)
  }

  removeDebugMesh() {
    this.scene.remove(this.debugMesh)
  }

  update() {
    let debugData = this.world.debugRender()
    this.debugGeometry.setAttribute( 'position', new THREE.BufferAttribute( debugData.vertices, 3 ))
  }

}
