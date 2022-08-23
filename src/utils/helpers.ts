import { Color } from "../Color";
import { IntersectionPoint } from "../Point/IntersectionPoint";
import { IPoint } from "../Point/IPoint";

// Linear interpolation between A and B
export const lerp = (A: number, B: number, percentage: number): number => {
    return A + (B - A) * percentage
};

// Linear interpolation between points A and B
const lerpPoint = (A: IPoint, B: IPoint, percentage: number): IntersectionPoint => {
    const x = lerp(A.x, B.x, percentage);
    const y = lerp(A.y, B.y, percentage);

    return new IntersectionPoint(x, y, percentage);
};

export const getIntersection = (A: IPoint, B: IPoint, C: IPoint, D: IPoint): IntersectionPoint | null => {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {              
            return lerpPoint(A, B, t);
        }
    }

    return null;
};

// Generate Car colors
export const getCarColor = (color: Color): string => {
    if(color != Color.Random){
        return color as string;
    }

    const hue = 290 + Math.random() * 260;

    return `hsl(${hue}, 100%, 60%)`;
};