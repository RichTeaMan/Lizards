export class Message<T> {

    readonly messageType: string;

    readonly payload: T;

    constructor (messageType: string, payload: T) {
        this.messageType = messageType;
        this.payload = payload;
    }
}
