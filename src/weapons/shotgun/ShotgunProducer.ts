import { Producer } from "../../messageBus/producer";
import { SimulationState } from "../../game/SimulationState";
import { KeyEvent, State } from "../../messageBus/KeyEvent";
import { PointerState } from "../../messageBus/PointerState";
import { MessagePayload } from "../../messageBus/MessagePayload";
import { EndTurnMessagePayload } from "../../endTurn/EndTurnMessagePayload";
import { WeaponChoice } from "../../ui/WeaponChoice";
import { ShotgunConsumer } from "./ShotgunConsumer";
import { ShotgunPayload } from "./ShotgunPayload";

export class ShotgunProducer implements Producer, WeaponChoice {

    fetchMessageType(): string {
        return ShotgunConsumer.messageType;
    }

    produce(
        simulationScene: SimulationState,
        keyEvents: KeyEvent[],
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        pointerState: PointerState): MessagePayload[] {

        const payloads: MessagePayload[] = [];
        if (keyEvents.some(e => e.state === State.DOWN && e.code === 'Space')) {

            const velocity = 1000;

            const xD = pointerState.x - simulationScene.selectedLizard.x;
            const yD = pointerState.y - simulationScene.selectedLizard.y;

            const angle = Math.atan(yD / xD);
            let xR = velocity * Math.cos(angle);
            let yR = velocity * Math.sin(angle);

            if (xD < 0) {
                xR = -xR;
                yR = -yR;
            }

            const payload = new ShotgunPayload();
            payload.velocityX = xR;
            payload.velocityY = yR;
            payload.originX = simulationScene.selectedLizard.x;
            payload.originY = simulationScene.selectedLizard.y;

            payloads.push(payload);
            payloads.push(new EndTurnMessagePayload());
        }
        return payloads;
    }

    get name(): string {
        return "Shotgun";
    }

    get description(): string {
        return "Shotguns things.";
    }

    get weaponProducer(): Producer {
        return this;
    }

}
