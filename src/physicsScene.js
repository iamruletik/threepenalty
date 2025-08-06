import RAPIER from '@dimforge/rapier3d'

export class PhysicsScene {

  constructor(world) {
    this.world = world
  }

  createScene() {

        let floorCollider = RAPIER.ColliderDesc.cuboid(9.0, 0.1, 14)
        floorCollider.setTranslation(0,-1.9,0)
        this.world.createCollider(floorCollider)

        let gateSensor = RAPIER.ColliderDesc.cuboid(10, 3, 3)
                  .setSensor(true)
                  .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
        gateSensor.setTranslation(0,-0.6,-14.5)
        this.world.createCollider(gateSensor)



        // Create a dynamic rigid-body for a Ball
        let ballRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0.0, 1.0, 0.0)
            .setAdditionalMass(0.5)
        let ballRigidBody = this.world.createRigidBody(ballRigidBodyDesc)
        
        // Create a ball collider attached to the dynamic rigidBody.
        let ballColliderDesc = RAPIER.ColliderDesc.ball(0.55).setDensity(0.5)
        let ballCollider = this.world.createCollider(ballColliderDesc, ballRigidBody)
    
  }

}


