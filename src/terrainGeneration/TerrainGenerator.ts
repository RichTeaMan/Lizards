import { SimulationState } from "../game/SimulationState";

export interface TerrainGenerator {

    generate(simulationState: SimulationState): void;
}