import { MessagePayload } from "../messageBus/MessagePayload";

export class BazookaPayload implements MessagePayload {

    getType(): string {
        return "bazooka";
    }

    velocityX: number;
    velocityY: number;
    originX: number;
    originY: number;
}