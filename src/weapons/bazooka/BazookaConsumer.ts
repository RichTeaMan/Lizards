import { Consumer } from "../../messageBus/Consumer";
import { BazookaPayload } from "./BazookaPayload";
import { SimulationState } from "../../game/SimulationState";
import { Projectile } from "../../Projectile";
import { Combatant } from "../../Combatant";
import { Explosion } from "../../Explosion";
import { TerrainPiece } from "../../game/TerrainPiece";

export class BazookaConsumer implements Consumer<BazookaPayload> {
    fetchMessageType(): string {
        return "bazooka";
    }

    consume(simulationScene: SimulationState, payload: BazookaPayload): void {
        const projectile = new BazookaProjectile().initialise(simulationScene, payload.originX, payload.originY, payload.velocityX, payload.velocityY);

        simulationScene.projectiles.push(projectile);
    }

}

export class BazookaProjectile extends Projectile {
    onCombatantCollision(combatant: Combatant, simulationScene: SimulationState) {
        const explosion = new Explosion(this.x, this.y);
        explosion.damage = 35;
        explosion.explode(simulationScene);
        this.explode();
    }

    onTerrainCollision(terrain: TerrainPiece, simulationScene: SimulationState) {
        this.onCombatantCollision(null, simulationScene);
    }
}
