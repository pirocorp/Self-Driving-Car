import { Level } from "./Level";

export class NeuralNetwork {
    private _levels: Level[];

    constructor(neuronCounts: number[]){
        this._levels = [];

        for (let i = 0; i < neuronCounts.length - 1; i++) {
            const level = new Level(neuronCounts[i], neuronCounts[i + 1]);

            this._levels.push(level);
        }
    }

    public static feedForward(givenInputs: number[], network: NeuralNetwork): number[]{
        let outputs = Level.feedForward(givenInputs, network._levels[0]);

        for (let i = 1; i < network._levels.length; i++) {
            outputs = Level.feedForward(outputs, network._levels[i]);
        }

        return outputs;
    }

    public get levels(): Level[] {
        return this._levels;
    }
}