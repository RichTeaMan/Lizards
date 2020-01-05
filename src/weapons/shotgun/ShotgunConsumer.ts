import { Consumer } from "../../messageBus/consumer";
import { SimulationState } from "../../game/SimulationState";
import { Projectile } from "../../Projectile";
import { Combatant } from "../../Combatant";
import { Explosion } from "../../Explosion";
import { TerrainPiece } from "../../game/terrainPiece";
import { ShotgunPayload } from "./ShotgunPayload";

export class ShotgunConsumer implements Consumer<ShotgunPayload> {

    static readonly messageType = "shotgun";
    
    fetchMessageType(): string {
        return ShotgunConsumer.messageType;
    }

    consume(simulationScene: SimulationState, payload: ShotgunPayload): void {
        const projectile = new ShotgunProjectile().initialise(simulationScene, payload.originX, payload.originY, payload.velocityX, payload.velocityY);

        simulationScene.projectiles.push(projectile);
    }

}

export class ShotgunProjectile extends Projectile {
    onCombatantCollision(combatant: Combatant, simulationScene: SimulationState) {
        const explosion = new Explosion(this.x, this.y);
        explosion.damage = 15;
        explosion.explode(simulationScene);
        this.explode();
    }

    onTerrainCollision(terrain: TerrainPiece, simulationScene: SimulationState) {
        this.onCombatantCollision(null, simulationScene);
    }
}
