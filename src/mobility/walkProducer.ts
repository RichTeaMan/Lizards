import { Producer } from "../messageBus/producer";
import { SimulationState } from "../game/SimulationState";
import { MobilityPayload } from "./mobilityPayload";
import { KeyEvent } from "../messageBus/KeyEvent";
import { MessagePayload } from "../messageBus/MessagePayload";

export class WalkProducer implements Producer {

    fetchMessageType(): string {
        return "walk";
    }

    produce(
        simulationScene: SimulationState,
        keyEvents: KeyEvent[],
        cursors: Phaser.Types.Input.Keyboard.CursorKeys): MessagePayload[] {

        const payloads: MessagePayload[] = [];

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

        payloads.push(payload);
        return payloads;
    }
}
