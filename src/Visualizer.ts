import { Point } from "./2D/Point/Point";
import { Level } from "./AI/Level";
import { NeuralNetwork } from "./AI/NeuralNetwork";

export class Visualizer {

    public static drawNetwork(ctx: CanvasRenderingContext2D, network: NeuralNetwork | null) {

        if(network == null) {
            return
        }

        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;      

        const levelHeight = height / network.levels.length;

        for (let i = network.levels.length - 1; i >= 0; i--) {
            const percentage = network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1);
            const levelTop = top + Point.learpCoordinate(height - levelHeight, 0, percentage);

            const labels = i == network.levels.length - 1 ? ['🠉', '🠈', '🠊', '🠋'] : [];

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, labels);
        }
    }

    private static drawLevel(
        ctx: CanvasRenderingContext2D, 
        level: Level,
        left: number, 
        top: number, 
        width: number, 
        height: number, 
        outputLabels: string[]) {
        const right = left + width;
        const bottom = top + height;
        const nodeRadius = 18;

        const { inputs, outputs, weights, biases } = level;

        // Draw lines connecting layers (synapses)
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                const startX = Visualizer.getNodeX(inputs.length, i, left, right);
                const endX = Visualizer.getNodeX(outputs.length, j, left, right);

                ctx.beginPath();
                ctx.moveTo(startX, bottom);
                ctx.lineTo(endX, top);
                ctx.lineWidth = 2;
                ctx.strokeStyle = Visualizer.getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        // Draw input neurons
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.getNodeX(inputs.length, i, left, right);

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = this.getRGBA(inputs[i]);
            ctx.fill();
        }

        // Draw output neurons + biases
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.getNodeX(outputs.length, i, left, right);

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = this.getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2)
            ctx.strokeStyle = Visualizer.getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = (nodeRadius * 1.5) + "px Arial";
                ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
            }
        }
    }

    private static getNodeX(nodesCount: number, index: number, left: number, right: number) {
        const percentage = nodesCount == 1 ? 0.5 : index / (nodesCount - 1);

        return Point.learpCoordinate(left, right, percentage);
    }

    private static getRGBA(value: number): string {
        const alpha = Math.abs(value);

        const R = value < 0 ? 0 : 255;
        const G = R;
        const B = value > 0 ? 0 : 255;

        return `rgba(${R}, ${G}, ${B}, ${alpha})`;
    }
}