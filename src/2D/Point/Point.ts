import { IntersectionPoint } from "./IntersectionPoint";
import { IPoint } from "./IPoint";

export class Point implements IPoint{    
    constructor(private readonly _x: number, private readonly _y: number) {
    }

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public static lerp (A: IPoint, B: IPoint, percentage: number): IntersectionPoint {
        const x = this.learpCoordinate(A.x, B.x, percentage);
        const y = this.learpCoordinate(A.y, B.y, percentage);

        return new IntersectionPoint(x, y, percentage);
    };

    public static learpCoordinate(A: number, B: number, percentage: number): number {
        return A + (B - A) * percentage
    }
}
