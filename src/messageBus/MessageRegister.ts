import { MessagePayload } from "./MessagePayload";
import { Producer } from "./producer";

export interface MessageRegister {

    registerMessage(messagePayload: MessagePayload);

    changeWeaponProducer(producer: Producer);
}
