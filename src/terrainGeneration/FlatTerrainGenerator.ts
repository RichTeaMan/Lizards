import { TerrainGenerator } from "./TerrainGenerator";
import { SimulationState } from "../game/SimulationState";
import { TerrainPiece } from "../game/TerrainPiece";

export class FlatTerrainGenerator implements TerrainGenerator {

    generate(simulationState: SimulationState): void {
        for (let i = 0; i < simulationState.width; i++) {
            for (let j = simulationState.height / 2; j < simulationState.height; j++) {

                const terrain = new TerrainPiece(simulationState, i, j);
                simulationState.destructibleTerrain.push(terrain);
            }
        }
    }
}