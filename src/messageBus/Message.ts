import { MessagePayload } from "./MessagePayload";

export class Message<T extends MessagePayload> {

    readonly payload: T;

    constructor (payload: T) {
        this.payload = payload;
    }

    getType(): string {
        return this.payload.getType();
    }
}
