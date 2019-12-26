import { SimulationScene } from "../game/simulationScene";
import { Message } from "./message";

export interface Consumer<T> {

    consume(
        simulationScene: SimulationScene,
        message: Message<T>): void;
}