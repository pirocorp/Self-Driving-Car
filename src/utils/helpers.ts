import { Color } from "../Color";

// Generate Car colors
export const getCarColor = (color: Color): string => {
    if(color != Color.Random){
        return color as string;
    }

    const hue = 290 + Math.random() * 260;

    return `hsl(${hue}, 100%, 60%)`;
};