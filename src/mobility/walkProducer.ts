import { Producer } from "../messageBus/producer";
import { SimulationScene } from "../game/simulationScene";
import { MobilityPayload } from "./mobilityPayload";
import { KeyEvent } from "../messageBus/KeyEvent";

export class WalkProducer implements Producer<MobilityPayload> {

    fetchMessageType(): string {
        return "walk";
    }

    produce(
        simulationScene: SimulationScene,
        keyEvents: KeyEvent[],
        cursors: Phaser.Types.Input.Keyboard.CursorKeys): MobilityPayload {

        const payload = new MobilityPayload();
        // TODO: something better.
        // payload.lizardId = 0;
        if (cursors.left.isDown) {
            payload.left = true;
        }
        else if (cursors.right.isDown) {
            payload.right = true;
        }
        if (cursors.up.isDown) {
            payload.jump = true;
        }

        return payload;
    }
}
