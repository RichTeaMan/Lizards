import { TerrainGenerator } from "./TerrainGenerator";
import { SimulationState } from "../game/SimulationState";
import { TerrainPiece } from "../game/TerrainPiece";

export class SineWaveTerrainGenerator implements TerrainGenerator {

    generate(simulationState: SimulationState): void {
        for (let i = 0; i < simulationState.width; i++) {

            // a formula very carefully calculated by pure trial and error
            const startHeight = Math.floor(
                // distance between peaks
            (Math.sin((i / (2 * Math.PI)) * (simulationState.terrainPieceSize / 10))
                // amplitude of peaks
            * (100 / simulationState.terrainPieceSize) )
                // distance between game ceiling and terrain
             + simulationState.height / 2);

            for (let j = startHeight; j < (simulationState.height / 2) + (300 / simulationState.terrainPieceSize); j++) {

                const terrain = new TerrainPiece(simulationState, i, j);
                simulationState.destructibleTerrain.push(terrain);
            }
        }
    }
}