import { Generation } from "./AI/Generation";
import { Car } from "./Car/Car";
import { ControlType } from "./Car/Controls/ControlType";
import { Color } from "./UI/Color";
import { Render } from "./UI/Render";
import { Road } from "./UI/Road";

const carCanvas = <HTMLCanvasElement>document.getElementById('car-canvas');
carCanvas.width = 200;

const networkCanvas = <HTMLCanvasElement>document.getElementById('network-canvas');
networkCanvas.width = 400;

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const count = 100;
const cars = Generation.generateCars(count, road.getLaneCenter(1));

const traffic: Car[] = [
    new Car(road.getLaneCenter(1), -100, 30, 50, ControlType.DUMMY, 2, Color.Random),
    new Car(road.getLaneCenter(0), -300, 30, 50, ControlType.DUMMY, 2, Color.Random),
    new Car(road.getLaneCenter(2), -300, 30, 50, ControlType.DUMMY, 2, Color.Random),
    new Car(road.getLaneCenter(0), -500, 30, 50, ControlType.DUMMY, 2, Color.Random),
    new Car(road.getLaneCenter(1), -500, 30, 50, ControlType.DUMMY, 2, Color.Random),
    new Car(road.getLaneCenter(1), -700, 30, 50, ControlType.DUMMY, 2, Color.Random),
    new Car(road.getLaneCenter(2), -700, 30, 50, ControlType.DUMMY, 2, Color.Random),
    new Car(road.getLaneCenter(0), -1300, 30, 50, ControlType.DUMMY, 2, Color.Random),
    new Car(road.getLaneCenter(1), -900, 30, 50, ControlType.DUMMY, 2, Color.Random),
    new Car(road.getLaneCenter(2), -1300, 30, 50, ControlType.DUMMY, 2, Color.Random),
];

const renderer = new Render(carCanvas, networkCanvas);
animate(0);

function animate(timestamp: number) {
    renderer.render(traffic, road, cars, timestamp);

    requestAnimationFrame(animate);
}
