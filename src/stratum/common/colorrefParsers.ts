/*
 * Функции для парсинга и преобразования типа данных `ColorRef`.
 */

const systemColorTable = [
    "gray",
    "blue",
    "navy",
    "gray",
    "#b5b5b5",
    "white",
    "black",
    "black",
    "black",
    "white",
    "gray",
    "gray",
    "gray",
    "navy",
    "white",
    "#b5b5b5",
    "gray",
    "gray",
    "black",
    "gray",
    "white",
];

// const systemColorTable2: [number, number, number][] = [
//     [128, 128, 128], //"gray"
//     [0, 0, 255], //"blue"
//     [0, 0, 128], //"navy"
//     [128, 128, 128], //"gray"
//     [181, 181, 181], //"#b5b5b5"
//     [255, 255, 255], //"white"
//     [0, 0, 0], //"black"
//     [0, 0, 0], //"black"
//     [0, 0, 0], //"black"
//     [255, 255, 255], //"white"
//     [128, 128, 128], //"gray"
//     [128, 128, 128], //"gray"
//     [128, 128, 128], //"gray"
//     [0, 0, 128], //"navy"
//     [255, 255, 255], //"white"
//     [181, 181, 181], //"#b5b5b5"
//     [128, 128, 128], //"gray"
//     [128, 128, 128], //"gray"
//     [0, 0, 0], //"black"
//     [128, 128, 128], //"gray"
//     [255, 255, 255], //"white"
// ].map((e) => [e[0] / 255, e[1] / 255, e[2] / 255]);

const transparentFlag = 1 << 24;
const syscolorFlag = 2 << 24;

/**
 * Преобразует строку вида `transparent` / `syscolor(X)` / `rgb(X,Y,Z)` в числовое значение ColorRef.
 *
 * Используется при парсинге дефолтных переменных имиджа.
 */
export function parseColorRef(value: string) {
    const num = parseInt(value);
    if (!isNaN(num)) return num;

    const val = value.toLowerCase().trim();

    // "rgb(3,200,127)" -> 3 | (200 << 8) | (127 << 16)
    if (val.startsWith("rgb")) {
        const values = val
            .split("(")[1]
            .split(")")[0]
            .split(",")
            .map((v) => parseInt(v));
        return values[0] | (values[1] << 8) | (values[2] << 16);
    }

    // "transparent"
    if (val.startsWith("transparent")) return transparentFlag;

    // "syscolor(14)" -> 14
    if (val.startsWith("syscolor")) return syscolorFlag | parseInt(val.split("(")[1].split(")")[0]);

    throw Error(`Неизвестный код цвета: ${value}`);
}

/**
 * Преобразует числовое значение colorref в понятный браузеру цвет.
 *
 * Вызывается из системы рендереринга.
 */
export function colorrefToCSSColor(colorref: number) {
    if (colorref & transparentFlag) return "transparent";

    const r = colorref & 255;
    if (colorref & syscolorFlag) return systemColorTable[r] || "black";

    const g = (colorref >> 8) & 255;
    const b = (colorref >> 16) & 255;
    return `rgb(${r},${g},${b})`;
}

export function rgbToCref(r: number, g: number, b: number, type: number): number {
    const flag = type === 1 ? transparentFlag : type === 2 ? syscolorFlag : 0;
    return (r & 255) | ((g & 255) << 8) | ((b & 255) << 16) | flag;
}

export function crefToR(cref: number): number {
    return cref & 255;
}
export function crefToG(cref: number): number {
    return (cref >> 8) & 255;
}
export function crefToB(cref: number): number {
    return (cref >> 16) & 255;
}

// export function colorrefToRGB(colorref: number): [number, number, number] | null {
//     if (colorref & transparentFlag) return null;

//     const r = colorref & 255;
//     if (colorref & syscolorFlag) return systemColorTable2[r] || [0, 0, 0];

//     const g = (colorref >> 8) & 255;
//     const b = (colorref >> 16) & 255;
//     return [r / 255, g / 255, b / 255];
// }
