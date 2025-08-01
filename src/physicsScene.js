import RAPIER from '@dimforge/rapier3d'

export class PhysicsScene {

  constructor(world) {
    this.world = world
  }

  createScene() {

        let floorCollider = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0)
        floorCollider.setTranslation(0,-1,0)
        this.world.createCollider(floorCollider)

        // Create a dynamic rigid-body.
        let ballRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0.0, 1.0, 0.0)
            .setLinvel(0.0, 2.0, -8.0)
            .setAngvel({ x: 3.0, y: 3.0, z: -3.0 })
            .setAdditionalMass(0.5)
            .setLinearDamping(0.2)
            .setAngularDamping(0.2)
        let ballRigidBody = this.world.createRigidBody(ballRigidBodyDesc)
        ballRigidBody.addForce({ x: 0.0, y: 1.0, z: -1.0 }, true)
        
        // Create a ball collider attached to the dynamic rigidBody.
        let ballColliderDesc = RAPIER.ColliderDesc.ball(0.75).setDensity(0.5)
        let ballCollider = this.world.createCollider(ballColliderDesc, ballRigidBody)
    
  }

}


