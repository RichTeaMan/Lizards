import { Producer } from "../messageBus/producer";

export interface WeaponChoice {
    name: string;
    description: string;
    weaponProducer: Producer;
}
