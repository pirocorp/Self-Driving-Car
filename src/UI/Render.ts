import { Car } from "../Car/Car";

import { Visualizer } from "./Visualizer";
import { carAiKey } from "../GlobalConstants";
import { Road } from "./Road";

export class Render {
    private carCtx: CanvasRenderingContext2D;
    private networkCtx: CanvasRenderingContext2D;

    private bestCar: Car|null = null;    

    constructor(
        private carCanvas: HTMLCanvasElement, 
        private networkCanvas: HTMLCanvasElement) {
        this.carCtx = carCanvas.getContext('2d') ?? (() => {throw new Error('Cannot create Car canvas context')})();
        this.networkCtx = networkCanvas.getContext('2d') ?? (() => { throw new Error('Cannot create Network canvas context') })();

        this.attachEventListeners();
    }

    public render(traffic: Car[], road: Road, cars: Car[], bestCar: Car, timestamp: number): void {
        this.bestCar = bestCar;

        for (let i = 0; i < traffic.length; i++) {
            traffic[i].update(road.borders, []);
        }

        for (let i = 0; i < cars.length; i++) {
            const car = cars[i];
            car.update(road.borders, traffic);
        }

        // Fitness function
        // this.bestCar = Fitness.fit(cars);

        this.carCanvas.height = window.innerHeight;
        this.networkCanvas.height = window.innerHeight;

        this.carCtx.save();
        this.carCtx.translate(0, -bestCar.y + this.carCanvas.height * 0.7);

        road.draw(this.carCtx);

        for (let i = 0; i < traffic.length; i++) {
            traffic[i].draw(this.carCtx);
        }

        this.carCtx.globalAlpha = 0.2;

        for (let i = 0; i < cars.length; i++) {
            const car = cars[i];
            car.draw(this.carCtx);
        }

        this.carCtx.globalAlpha = 1;
        bestCar.draw(this.carCtx, true);

        this.carCtx.restore();

        this.networkCtx.lineDashOffset = - timestamp / 50;       
        Visualizer.drawNetwork(this.networkCtx, bestCar.brain);        
    }

    private attachEventListeners() {
        const save = () => localStorage.setItem(carAiKey, JSON.stringify(this.bestCar?.brain));
        const discard = () => localStorage.removeItem(carAiKey);        

        const saveButton = <HTMLButtonElement>document.getElementById('save-button');
        saveButton.addEventListener('click', save);

        const discardButton = document.getElementById('discard-button');
        discardButton?.addEventListener('click', discard);
    }
}