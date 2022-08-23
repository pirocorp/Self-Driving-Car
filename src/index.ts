import { Car } from "./Car/Car";
import { ControlType } from "./Car/Controls/ControlType";
import { Road } from "./Road";

const carCanvas = <HTMLCanvasElement>document.getElementById('car-canvas');
carCanvas.width = 200;

const networkCanvas = <HTMLCanvasElement>document.getElementById('network-canvas');
networkCanvas.width = 800;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, ControlType.KEYS);

animate();

function animate(): void {
    if (carCtx == null || networkCtx == null) {
        throw new Error('No car or network canvas');
    }

    car.update(road.borders, []);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    car.draw(carCtx, true);

    carCtx.restore();
    requestAnimationFrame(animate);
}
