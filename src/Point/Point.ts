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
}
