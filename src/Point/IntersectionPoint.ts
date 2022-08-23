import { Point } from "./Point";

export class IntersectionPoint extends Point {

    constructor(x: number, y: number, private _offset: number) {
        super(x, y);
    }

    public get offset() {
        return this._offset;
    }
}