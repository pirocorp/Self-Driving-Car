import { ControlType } from "./ControlType";

export class Controls {
    private forward: boolean;
    private left: boolean;
    private right: boolean;
    private reverse: boolean;

    constructor(controlType: ControlType) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch(controlType) {
            case ControlType.KEYS:
                this.addKeyboardListeners();
                break;
            case ControlType.DUMMY:
                this.forward = true;
                break;
        }
    }

    private addKeyboardListeners(): void {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        };

        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        };
    }
}