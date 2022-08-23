import { IntersectionPoint } from "../../Point/IntersectionPoint";
import { IPoint } from "../../Point/IPoint";
import { getIntersection } from "../../utils/helpers";
import { IRay } from "./IRay";

export class Ray implements IRay {
    constructor(private _start: IPoint, private _end: IPoint){        
    }

    public get start() {
        return this._start;
    }

    public get end() {
        return this._end;
    }

    public static touchRay(A: IRay, B: IRay): IntersectionPoint | null {                   
        return getIntersection(A.start, A.end, B.start, B.end);
    }

    public static touchPolygon(A: IRay, polygon: IPoint[]): IntersectionPoint | null {  
        let touches: IntersectionPoint[] = [];

        for (let i = 0; i < polygon.length; i++) {
            const value = getIntersection(
                A.start,
                A.end,
                polygon[i],
                polygon[(i + 1) % polygon.length]
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
}