import { Point } from "../2D/Point/Point";
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

    public get levels(): Level[] {
        return this._levels;
    }

    public static feedForward(givenInputs: number[], network: NeuralNetwork): number[]{
        let outputs = Level.feedForward(givenInputs, network._levels[0]);

        for (let i = 1; i < network._levels.length; i++) {
            outputs = Level.feedForward(outputs, network._levels[i]);
        }

        return outputs;
    }    

    public static mutate(network: NeuralNetwork, amount: number = 1): void{
        network._levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {                
                level.biases[i] = Point.learpCoordinate(level.biases[i], Math.random() * 2 - 1, amount);
            }    

            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = Point.learpCoordinate(level.weights[i][j], Math.random() * 2 - 1, amount);
                }
            }            
        });
    }

    public static parse(serializedBrain: string): NeuralNetwork {
        const networkData = <NeuralNetwork>JSON.parse(serializedBrain);

        const inputs = networkData._levels.map(l => l.inputs.length);
        const outputs = networkData._levels.map(l => l.outputs.length);

        const neuronCounts: number[] = new Array(inputs.length + 1);       

        for(let i = 0; i < inputs.length; i++) {
            neuronCounts[i] = inputs[i];
            neuronCounts[i + 1] = outputs[i];
        }

        const network = new NeuralNetwork(neuronCounts);

        for (let i = 0; i < network._levels.length; i++) {
            network._levels[i].biases = networkData._levels[i].biases;
            network._levels[i].weights = networkData._levels[i].weights;
            network._levels[i].inputs = networkData._levels[i].inputs;
            network._levels[i].outputs = networkData._levels[i].outputs;            
        }        

        return network;
    }
}