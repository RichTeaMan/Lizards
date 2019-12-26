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

        simulationScene.selectedLizard.setVelocityX(payload.velocityX);
        simulationScene.selectedLizard.setVelocityY(payload.velocityY);
    }

}
