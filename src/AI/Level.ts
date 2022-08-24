export class Level {
    public inputs: number[];
    public outputs: number[];
    public biases: number[];
    public weights: number[][];

    /**
     * 
     * @param inputCount - Values from the car sensors
     * @param outputCount - Computed using weights and biases
     */
    constructor(inputCount: number, outputCount: number){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);

        // each output neuron has a bias, a value above it will fire
        this.biases = new Array(outputCount);

        // every input neuron will be connected to every output neuron
        this.weights = [];

        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        // Initialize with random values weights and biases between [-1, 1].
        Level.randomize(this);
    }

    public static feedForward(givenInputs: number[], level: Level): number[] {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;

            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            // It can be written sum + level.biases[i] > 0
            // In very simple network this is the line equation (one sensor/input)
            // ws + b = 0 w - weight, b - bias, s - sensor
            // weight controls the slope, bias controls y offset (intercept)
            // there is function like this for each output
            // Neurons will fire if the value of the function is above zero

            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }

    private static randomize(level: Level): void {
        // Get random value in interval [-1, 1].
        const valueInInterval = () => Math.random() * 2 - 1;

        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = valueInInterval();
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = valueInInterval();
        }
    }
}