import { Color } from "../UI/Color";
import { IPoint } from "../2D/Point/IPoint";
import { Sensor } from "./Sensor/Sensor";
import { Controls } from "./Controls/Controls";
import { ControlType } from "./Controls/ControlType";
import { Segment } from "../2D/Segment";
import { Polygon } from "../2D/Polygon";
import { NeuralNetwork } from "../AI/NeuralNetwork";

export class Car {
    private readonly acceleration: number = 0.2;
    private readonly friction: number = 0.05;

    public brain: NeuralNetwork | null = null;

    private speed: number;
    private damaged: boolean;
    private useBrain: boolean;
    private color: string; 
    public angle: number;
    public polygon: Polygon;  
    private controls: Controls;

    private sensor: Sensor | null = null;    

    /**
     * 
     * @param x - The x coordinate of the car 
     * @param y - The y coordinate of the car 
     * @param width - The width of the car
     * @param height - The height of the car
     * @param controlType - Control of the car (ex. AI, Keys, etc)
     * @param maxSpeed - Max speed of the car
     * @param color - Color of the car
     */
    constructor(
        private _x: number, 
        private _y: number, 
        private width: number, 
        private height: number, 
        controlType: ControlType, 
        private maxSpeed: number = 3, 
        color: Color = Color.Blue) {
            this.speed = 0;
            this.angle = 0;
            this.damaged = false;
            this.useBrain = controlType == ControlType.AI;
            this.color = this.getCarColor(color);
            this.polygon = this.createPolygon();

            if(controlType != ControlType.DUMMY) {
                this.sensor = new Sensor(this);

                // One 'hidden' layer with 6 neurons
                this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4])
            }

            this.controls = new Controls(controlType);
    }

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public draw(ctx: CanvasRenderingContext2D, drawSensor: boolean = false): void{       
        //this.defaultDrawing(ctx, drawSensor);
        this.defaultDrawing(ctx, drawSensor);
    }

    public update(roadBorders: Segment[], traffic: Car[]): void {
        if (!this.damaged) {
            this.move();
            this.polygon = this.createPolygon();
            this.damaged = this.assessDamage(roadBorders, traffic);
        }

        if(this.sensor) {
            this.sensor.update(roadBorders, traffic);

            if(this.brain){
                const outputs = NeuralNetwork.feedForward(this.sensor.readings, this.brain)
                    .map(x => x > 0 ? true : false);

                if(this.useBrain) {
                    this.controls.forward = outputs[0];
                    this.controls.left = outputs[1];
                    this.controls.right = outputs[2];
                    this.controls.reverse = outputs[3];
                }
            }
        }
    }

    private createPolygon(): Polygon {
        const points: IPoint[] = [];

        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        const topRight = {
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        };

        const topLeft = {
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        };

        const bottomLeft = {
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        };

        const bottomRight = {
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        };

        points.push(topRight, topLeft, bottomLeft, bottomRight);

        return new Polygon(points);
    }

    private defaultDrawing2(ctx: CanvasRenderingContext2D, drawSensor: boolean = false): void {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(- this.angle);

        ctx.beginPath();

        const carX = -this.width / 2;
        const carY = -this.height / 2;

        ctx.rect(carX, carY, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();

        this.sensor?.draw(ctx);
    }

    private defaultDrawing(ctx: CanvasRenderingContext2D, drawSensor: boolean = false) {
        if (this.damaged) {
            ctx.fillStyle = Color.Gray;
        } else {
            ctx.fillStyle = this.color;
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon.points[0].x, this.polygon.points[0].y);

        for (let i = 1; i < this.polygon.points.length; i++) {
            ctx.lineTo(this.polygon.points[i].x, this.polygon.points[i].y)
        }

        ctx.fill();

        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
    }

    private move(): void {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }

        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;

            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }

            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this._x -= Math.sin(this.angle) * this.speed;
        this._y -= Math.cos(this.angle) * this.speed;
    }

    private assessDamage(roadBorders: Segment[], traffic: Car[]): boolean {
        for (let i = 0; i < roadBorders.length; i++) {
            const intersection = Segment.intersectPolygon(roadBorders[i], this.polygon)

            if (intersection) {
                return true;
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (Polygon.intersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }

        return false;
    }

    private getCarColor(color: Color): string {
        if (color != Color.Random) {
            return color as string;
        }

        const hue = 290 + Math.random() * 260;

        return `hsl(${hue}, 100%, 60%)`;
    }
}