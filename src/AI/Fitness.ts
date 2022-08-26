import { Car } from "../Car/Car";

export class Fitness {
    public static fit(cars: Car[]): Car {
        return cars.find(c => c.y == Math.min(...cars.map(c => c.y))) ?? cars[0];
    }
}