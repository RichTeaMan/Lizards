import { Producer } from "../messageBus/producer";
import { BazookaPayload } from "./BazookaPayload";
import { SimulationScene } from "../game/simulationScene";
import { KeyEvent, State } from "../messageBus/KeyEvent";
import { PointerState } from "../messageBus/PointerState";

export class BazookaProducer implements Producer<BazookaPayload> {
    fetchMessageType(): string {
        return "bazooka";
    }

    produce(
        simulationScene: SimulationScene,
        keyEvents: KeyEvent[],
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        pointerState: PointerState): BazookaPayload {

        let payload: BazookaPayload = null;
        if (keyEvents.some(e => e.state === State.DOWN && e.code === 'Space')) {

            const velocity = 500;

            const xD = pointerState.x - simulationScene.selectedLizard.x;
            const yD = pointerState.y - simulationScene.selectedLizard.y;

            const angle = Math.atan(yD / xD);
            let xR = velocity * Math.cos(angle);
            let yR = velocity * Math.sin(angle);

            if (xD < 0) {
                xR = -xR;
                yR = -yR;
            }

            payload = new BazookaPayload();
            payload.velocityX = xR;
            payload.velocityY = yR;
            payload.originX = simulationScene.selectedLizard.x;
            payload.originY = simulationScene.selectedLizard.y;
        }
        return payload;
    }

}
