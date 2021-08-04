export function coordsToSVGPoints(coords: readonly number[]): string {
    let str = "";
    for (let i = 0; i < coords.length; i += 2) {
        str += coords[i] + "," + coords[i + 1] + " ";
    }
    return str;
}
