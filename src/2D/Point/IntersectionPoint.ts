import { IPoint } from "./IPoint";

// Resolving issue with circularly importing classes, more info at: https://stackoverflow.com/questions/43176006/typeerror-class-extends-value-undefined-is-not-a-function-or-null
// Thats why IntersectionPoint do not inherit from Point

export class IntersectionPoint implements IPoint {

    constructor(private readonly _x: number, private readonly _y: number, private _offset: number) {
    }

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public get offset() {
        return this._offset;
    }
}