import { Consumer } from "../messageBus/consumer";
import { BazookaPayload } from "./BazookaPayload";
import { SimulationScene} from "../game/simulationScene";
import { Projectile } from "../Projectile";
import { Combatant } from "../Combatant";
import { Explosion } from "../Explosion";
import { TerrainPiece } from "../game/terrainPiece";

export class BazookaConsumer implements Consumer<BazookaPayload> {
    fetchMessageType(): string {
        return "bazooka";
    }    
    
    consume(simulationScene: SimulationScene, payload: BazookaPayload): void {
        const projectile = new BazookaProjectile().initialise(simulationScene, payload.originX, payload.originY, payload.velocityX, payload.velocityY);

        simulationScene.projectiles.push(projectile);
    }

}

export class BazookaProjectile extends Projectile {
    onCombatantCollision(combatant: Combatant, simulationScene: SimulationScene) {
        const explosion = new Explosion(this.getX(), this.getY());
        explosion.damage = 35;
        explosion.explode(simulationScene);
        this.remove();
    }

    onTerrainCollision(terrain: TerrainPiece, simulationScene: SimulationScene) {
        this.onCombatantCollision(null, simulationScene);
    }
}
