import { Car } from "./Car/Car";
import { ControlType } from "./Car/Controls/ControlType";
import { Color } from "./Color";
import { Road } from "./Road";

const carCanvas = <HTMLCanvasElement>document.getElementById('car-canvas');
carCanvas.width = 200;

const networkCanvas = <HTMLCanvasElement>document.getElementById('network-canvas');
networkCanvas.width = 800;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

if (carCtx == null || networkCtx == null) {
    throw new Error('No car or network canvas');
}

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, ControlType.KEYS);

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, ControlType.DUMMY, 2, Color.Red)
];

animate(carCtx, networkCtx);

function animate(carCtx: CanvasRenderingContext2D, networkCtx: CanvasRenderingContext2D): void {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    car.update(road.borders, traffic);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height * 0.7);

    road.draw(carCtx);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }

    car.draw(carCtx, true);

    carCtx.restore();
    requestAnimationFrame(() => animate(carCtx, networkCtx));
}
