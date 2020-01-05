import { MessagePayload } from "../../messageBus/MessagePayload";
import { ShotgunConsumer } from "./ShotgunConsumer";

export class ShotgunPayload implements MessagePayload {

    getType(): string {
        return ShotgunConsumer.messageType;
    }

    velocityX: number;
    velocityY: number;
    originX: number;
    originY: number;
}