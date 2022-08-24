import { IntersectionPoint } from "./Point/IntersectionPoint";
import { IPoint } from "./Point/IPoint";
import { Point } from "./Point/Point";
import { Polygon } from "./Polygon";

export class Segment {
    constructor(private _start: IPoint, private _end: IPoint){        
    }

    public get start() {
        return this._start;
    }

    public get end() {
        return this._end;
    }

    public static intersectSegment(A: Segment, B: Segment): IntersectionPoint | null {    
                       
        return this.getIntersection(A.start, A.end, B.start, B.end);
    }

    public static intersectPolygon(A: Segment, polygon: Polygon): IntersectionPoint | null {  
        let touches: IntersectionPoint[] = [];

        for (let i = 0; i < polygon.points.length; i++) {
            const value = this.getIntersection(
                A.start,
                A.end,
                polygon.points[i],
                polygon.points[(i + 1) % polygon.points.length]
            );

            if (value) {
                touches.push(value);
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

    private static getIntersection = (A: IPoint, B: IPoint, C: IPoint, D: IPoint): IntersectionPoint | null => {        
        const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
        const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
        const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

        if (bottom != 0) {
            const t = tTop / bottom;
            const u = uTop / bottom;

            if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
                return Point.lerp(A, B, t);
            }
        }

        return null;
    };
}
