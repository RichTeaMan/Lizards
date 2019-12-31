import { MessagePayload } from "../messageBus/MessagePayload";
import { EndTurnConsumer } from "./EndTurnConsumer";

export class EndTurnMessagePayload implements MessagePayload {
    getType(): string {
        return EndTurnConsumer.messageType;
    }

}