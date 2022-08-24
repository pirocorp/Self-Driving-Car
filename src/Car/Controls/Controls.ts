import { ControlType } from "./ControlType";

export class Controls {
    private _forward: boolean;
    private _left: boolean;
    private _right: boolean;
    private _reverse: boolean;

    constructor(controlType: ControlType) {
        this._forward = false;
        this._left = false;
        this._right = false;
        this._reverse = false;

        switch(controlType) {
            case ControlType.KEYS:
                this.addKeyboardListeners();
                break;
            case ControlType.DUMMY:
                this._forward = true;
                break;
        }
    }

    public get forward() {
        return this._forward;
    }

    public get left() {
        return this._left;
    }

    public get right() {
        return this._right;
    }

    public get reverse() {
        return this._reverse;
    }

    private addKeyboardListeners(): void {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this._left = true;
                    break;
                case "ArrowRight":
                    this._right = true;
                    break;
                case "ArrowUp":
                    this._forward = true;
                    break;
                case "ArrowDown":
                    this._reverse = true;
                    break;
            }
        };

        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this._left = false;
                    break;
                case "ArrowRight":
                    this._right = false;
                    break;
                case "ArrowUp":
                    this._forward = false;
                    break;
                case "ArrowDown":
                    this._reverse = false;
                    break;
            }
        };
    }
}