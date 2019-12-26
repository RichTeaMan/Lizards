import { SimulationScene } from "../game/simulationScene";

export interface Consumer<T> {

    fetchMessageType(): string;

    consume(
        simulationScene: SimulationScene,
        payload: T): void;
}