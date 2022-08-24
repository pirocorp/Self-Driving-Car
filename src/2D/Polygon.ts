import { IPoint } from "./Point/IPoint";
import { Segment } from "./Segment";

export class Polygon {
    constructor(private _points: IPoint[]) {        
    }

    public get points() {
        return this._points;
    }

    public static intersect(poly1: Polygon, poly2: Polygon) {
        for (let i = 0; i < poly1.points.length; i++) {
            for (let j = 0; j < poly2.points.length; j++) {
                const A = poly1.points[i];
                const B = poly1.points[(i + 1) % poly1.points.length];
                const C = poly2.points[j];
                const D = poly2.points[(j + 1) % poly2.points.length];

                const segment1 = new Segment(A, B);
                const segment2 = new Segment(C, D);                

                const touch = Segment.intersectSegment(segment1, segment2);

                if (touch) {
                    return true;
                }
            }
        }

        return false;
    }
}