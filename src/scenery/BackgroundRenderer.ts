import { SimulationState } from "../game/SimulationState";

export interface BackgroundRenderer {
    render(simulationScene: SimulationState): void;
}