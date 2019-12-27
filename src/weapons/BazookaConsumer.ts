import { Consumer } from "../messageBus/consumer";
import { BazookaPayload } from "./BazookaPayload";

export class BazookaConsumer implements Consumer<BazookaPayload> {
    fetchMessageType(): string {
        return "bazooka";
    }    
    
    consume(simulationScene: import("../game/simulationScene").SimulationScene, payload: BazookaPayload): void {
        const projectile = simulationScene.scene.physics.add.sprite(payload.originX, payload.originY, "bazookaRocket");
        projectile.body.onCollide = true;

        projectile.setVelocityX(payload.velocityX);
        projectile.setVelocityY(payload.velocityY);

        simulationScene.projectiles.push(projectile);
    }

    
}