import { LineElementArrow } from "stratum/fileFormats/vdr";
import { LineElement2DArrow } from "stratum/graphics/elements/lineElement2d";

export function createArrow(e: LineElementArrow, reverse: boolean): LineElement2DArrow | null {
    if (e.angle === 0 || e.length === 0) return null;

    const opposite = Math.abs(e.length * Math.sin(e.angle));
    const adjacent = Math.abs(e.length * Math.cos(e.angle));
    const coords = reverse ? [0, 0, adjacent, opposite, 0, opposite * 2] : [adjacent, 0, 0, opposite, adjacent, opposite * 2];
    return {
        coords,
        fill: e.fill,
        width: adjacent,
        oy: opposite,
    };
}
