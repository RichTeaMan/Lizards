import { MessagePayload } from "./MessagePayload";
import { Producer } from "./Producer";

export interface MessageRegister {

    registerMessage(messagePayload: MessagePayload);

    changeWeaponProducer(producer: Producer);
}
