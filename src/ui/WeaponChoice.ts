import { Producer } from "../messageBus/Producer";

export interface WeaponChoice {
    name: string;
    description: string;
    weaponProducer: Producer;
}
