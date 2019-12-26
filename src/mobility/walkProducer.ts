import { Producer } from "../messageBus/producer";
import { SimulationScene } from "../game/simulationScene";
import { MobilityPayload } from "./mobilityPayload";

export class WalkProducer implements Producer<MobilityPayload> {

    fetchMessageType(): string {
        return "walk";
    }

    produce(
        simulationScene: SimulationScene,
        event: KeyboardEvent,
        cursors: Phaser.Types.Input.Keyboard.CursorKeys): MobilityPayload {

        const payload = new MobilityPayload();
        // TODO: something better.
        payload.lizardId = 0;
        if (cursors.left.isDown) {
            payload.velocityX = -160;
        }
        else if (cursors.right.isDown) {
            payload.velocityX = 160;
        }
        if (cursors.up.isDown && simulationScene.selectedLizard.body.touching.down) {
            payload.velocityY = -120;
        }

        return payload;
    }
}