import { SimulationScene } from "../game/simulationScene";

export interface BackgroundRenderer {
    render(simulationScene: SimulationScene): void;
}