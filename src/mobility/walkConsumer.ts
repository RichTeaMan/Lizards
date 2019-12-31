import { SimulationScene } from "../game/simulationScene";
import { Consumer } from "../messageBus/consumer";
import { MobilityPayload } from "./mobilityPayload";

export class WalkConsumer implements Consumer<MobilityPayload> {
    
    fetchMessageType(): string {
        return "walk";
    }

    consume(
        simulationScene: SimulationScene,
        payload: MobilityPayload): void {

        if (payload.left) {
            simulationScene.selectedLizard.sprite.setVelocityX(-160);
        }
        else if (payload.right) {
            simulationScene.selectedLizard.sprite.setVelocityX(160);
        }
        else {
            simulationScene.selectedLizard.sprite.setVelocityX(0);
        }
        if (payload.jump && simulationScene.selectedLizard.sprite.body.touching.down) {
            simulationScene.selectedLizard.sprite.setVelocityY(-120);
        }
    }

}
