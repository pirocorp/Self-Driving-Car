import { Car } from "../Car";
import { IntersectionPoint } from "../../2D/Point/IntersectionPoint";
import { Segment } from "../../2D/Segment";
import { Point } from "../../2D/Point/Point";

export class Sensor {
    private readonly rayLength = 150;
    private readonly raySpread = Math.PI / 2;

    private rays: Segment[] = [];
    private _readings: IntersectionPoint[] = [];

    constructor(private car: Car, private readonly _rayCount = 5){
    }

    public get rayCount(): number {
        return this._rayCount;
    }

    public get readings(): number[] {
        return this._readings.map(x => x == null ? 0 : 1 - x.offset);
    }

    public update(roadBorders: Segment[], traffic: Car[]): void {
        this.castRays();

        this._readings = [];

        for (let i = 0; i < this.rays.length; i++) {
            const reading = this.getReading(this.rays[i], roadBorders, traffic);

            this._readings.push(reading as IntersectionPoint);          
        }        
    }

    public draw(ctx: CanvasRenderingContext2D) {        
        for (let i = 0; i < this._rayCount; i++) {
            let end = this.rays[i].end;        

            if (this._readings[i]) {
                end = this._readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";

            const ray = this.rays[i];
            ctx.moveTo(ray.start.x, ray.start.y);
            ctx.lineTo(end.x, end.y);

            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";

            ctx.moveTo(ray.end.x, ray.end.y);
            ctx.lineTo(end.x, end.y);

            ctx.stroke();
        }
    }

    private castRays(): void {
        this.rays = [];

        for (let i = 0; i < this._rayCount; i++) {
            const start = new Point(this.car.x, this.car.y);

            const A = this.raySpread / 2;
            const B = - this.raySpread / 2;            
            const percentage = this._rayCount == 1 ? 0.5 : i / (this._rayCount - 1);

            const rayAngle = Point.learpCoordinate(A, B, percentage) + this.car.angle;

            const endX = this.car.x - Math.sin(rayAngle) * this.rayLength;
            const endY = this.car.y - Math.cos(rayAngle) * this.rayLength;

            const end = new Point(endX, endY);
            const ray = new Segment(start, end);

            this.rays.push(ray);
        }        
    }

    private getReading(ray: Segment, roadBorders: Segment[], traffic: Car[]): IntersectionPoint | null{        
        let touches: IntersectionPoint[] = [];

        for (let i = 0; i < roadBorders.length; i++) {           

            const touch = Segment.intersectSegment(ray, roadBorders[i]);

            if (touch) {
                touches.push(touch);
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
    
            const touch = Segment.intersectPolygon(ray, poly);
    
            if (touch) {
                touches.push(touch);
            }
        }

        if (touches.length == 0) {
            return null;
        } else {
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);

            return touches.find(e => e.offset == minOffset) ?? null;
        }
    }
}