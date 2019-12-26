import { Message } from "../messageBus/message";
import { SimulationScene } from "../game/simulationScene";
import { Consumer } from "../messageBus/consumer";
import { MobilityPayload } from "./mobilityPayload";

export class WalkConsumer implements Consumer<MobilityPayload> {

    consume(
        simulationScene: SimulationScene,
        message: Message<MobilityPayload>): void {

        simulationScene.selectedLizard.setVelocityX(message.message.velocityX);
        simulationScene.selectedLizard.setVelocityY(message.message.velocityY);
    }

}
