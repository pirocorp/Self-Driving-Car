import { Car } from "../Car/Car";
import { ControlType } from "../Car/Controls/ControlType";
import { carAiKey } from "../GlobalConstants";
import { NeuralNetwork } from "./NeuralNetwork";

export class Generation {
    public static generateCars(count: number, lane: number): Car[] {
        const cars = this.generateRandomCars(count, lane);
        const serializedBrain = localStorage.getItem(carAiKey);

        if (serializedBrain) {
            for (let i = 0; i < cars.length; i++) {             
                const carBrain = NeuralNetwork.parse(serializedBrain);          
                cars[i].brain = carBrain;

                if (i != 0) {
                    NeuralNetwork.mutate(carBrain, 0.1);                    
                }
            }
        }

        return cars;
    }

    private static generateRandomCars (count: number, lane: number) {
        const cars: Car[] = [];

        for (let i = 0; i < count; i++) {
            cars.push(new Car(lane, 100, 30, 50, ControlType.AI));
        }

        return cars;
    }
}