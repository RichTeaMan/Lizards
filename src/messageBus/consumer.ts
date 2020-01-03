import { SimulationState } from "../game/SimulationState";

export interface Consumer<T> {

    fetchMessageType(): string;

    consume(
        simulationScene: SimulationState,
        payload: T): void;
}