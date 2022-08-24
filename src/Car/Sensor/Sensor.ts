import { Car } from "../Car";
import { IntersectionPoint } from "../../Point/IntersectionPoint";
import { Ray } from "./Ray";
import { Point } from "../../Point/Point";
import { getIntersection, lerp } from "../../utils/helpers";
import { IRay } from "./IRay";

export class Sensor {
    private readonly rayLength = 150;
    private readonly raySpread = Math.PI / 2;

    private rays: Ray[] = [];
    private readings: IntersectionPoint[] = [];

    constructor(private car: Car, private readonly rayCount = 5){
    }

    public update(roadBorders: IRay[], traffic: Car[]): void {
        this.castRays();

        this.readings = [];

        for (let i = 0; i < this.rays.length; i++) {
            const reading = this.getReading(this.rays[i], roadBorders, traffic);

            this.readings.push(reading as IntersectionPoint);          
        }        
    }

    public draw(ctx: CanvasRenderingContext2D) {        
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i].end;        

            if (this.readings[i]) {
                end = this.readings[i];
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

        for (let i = 0; i < this.rayCount; i++) {
            const start = new Point(this.car.x, this.car.y);

            const A = this.raySpread / 2;
            const B = - this.raySpread / 2;            
            const percentage = this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1);

            const rayAngle = lerp(A, B, percentage) + this.car.angle;

            const endX = this.car.x - Math.sin(rayAngle) * this.rayLength;
            const endY = this.car.y - Math.cos(rayAngle) * this.rayLength;

            const end = new Point(endX, endY);
            const ray = new Ray(start, end);

            this.rays.push(ray);
        }        
    }

    private getReading(ray: Ray, roadBorders: IRay[], traffic: Car[]): IntersectionPoint | null{        
        let touches: IntersectionPoint[] = [];

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = Ray.touchRay(ray, roadBorders[i]);

            if (touch) {
                touches.push(touch);
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
    
            const touch = Ray.touchPolygon(ray, poly);
    
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