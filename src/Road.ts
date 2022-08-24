import { Segment } from "./2D/Segment";
import { Point } from "./2D/Point/Point";

export class Road {
    private readonly infinity = 1000000;

    private left: number;
    private right: number;
    private top: number;
    private bottom: number;
    
    public borders: Segment[];

    /**
     * 
     * @param x - Road center
     * @param width - Road width
     * @param laneCount - Number of lanes, default = 3
     */
    constructor(private x: number, private width: number, private laneCount = 3) {
        this.left = x - width / 2;
        this.right = x + width / 2;

        this.top = -this.infinity;
        this.bottom = this.infinity;

        const topLeft: Point = new Point(this.left, this.top);
        const topRight: Point = new Point(this.right, this.top);
        const bottomLeft: Point = new Point(this.left, this.bottom);
        const bottomRight: Point = new Point(this.right, this.bottom);

        this.borders = [
            new Segment(topLeft, bottomLeft), 
            new Segment(topRight, bottomRight)
        ];
    }

    public getLaneCenter(laneIndex: number): number {
        const laneWidth = this.width / this.laneCount;

        const lane = Math.min(laneIndex, this.laneCount - 1);

        return this.left + laneWidth / 2 + lane * laneWidth;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = 5
        ctx.strokeStyle = "white";

        for (let i = 1; i < this.laneCount; i++) {
            const x = Point.learpCoordinate(this.left, this.right, i / this.laneCount);

            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);

        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border.start.x, border.start.y);
            ctx.lineTo(border.end.x, border.end.y);
            ctx.stroke();
        });
    }
}