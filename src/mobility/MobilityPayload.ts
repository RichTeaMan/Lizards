import { MessagePayload } from "../messageBus/MessagePayload";

export class MobilityPayload implements MessagePayload {
    getType(): string {
        return "walk";
    }

    left: boolean;
    right: boolean;
    jump: boolean;
}