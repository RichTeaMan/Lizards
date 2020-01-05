import { SimulationState } from "../game/SimulationState";
import { Consumer } from "../messageBus/consumer";
import { MobilityPayload } from "./mobilityPayload";

export class WalkConsumer implements Consumer<MobilityPayload> {
    
    fetchMessageType(): string {
        return "walk";
    }

    consume(
        simulationScene: SimulationState,
        payload: MobilityPayload): void {

        if (payload.left) {
            simulationScene.selectedLizard.velocityLeft();
        }
        else if (payload.right) {
            simulationScene.selectedLizard.velocityRight();
        }
        else {
            simulationScene.selectedLizard.velocityReset();
        }
        if (payload.jump && simulationScene.selectedLizard.sprite.body.touching.down) {
            simulationScene.selectedLizard.jump();
        }
    }

}
