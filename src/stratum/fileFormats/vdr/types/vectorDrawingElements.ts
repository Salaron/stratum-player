import { Point2D } from "stratum/helpers/types";

export interface Hyperbase {
    /**
     * Гипербаза отключена
     */
    disabled?: boolean;
    /**
     * 0 - Открыть окно
     * 1 - Запустить exe
     * 2 - грузить проект
     * 3 - ничего не делать
     * 4 - системная команда
     */
    openMode?: number;
    /**
     * Имя VDR-файла или класса, файла проекта или запускаемого exe.
     */
    target?: string;
    /**
     * Имя объекта, которому посылается WM_HYPERJUMP.
     */
    objectName?: string;
    /**
     * Имя открываемого окна.
     */
    windowName?: string;
    /**
     * Параметры открытия проекта.
     */
    params?: string;
    effect?: string;
    time?: number;
}

export interface ElementBase {
    handle: number;
    options: number;
    name?: string;
    hyperbase?: Hyperbase;
}

export interface Element2dBase extends ElementBase {
    originX: number;
    originY: number;
    width: number;
    height: number;
}

export interface GroupElement extends ElementBase {
    type: "group";
    childHandles: number[];
}

export interface LineElementArrow {
    angle: number;
    length: number;
    fill: boolean;
}

export interface LineElement extends Element2dBase {
    type: "line";
    penHandle: number;
    brushHandle: number;
    coords: number[];
    arrowA?: LineElementArrow;
    arrowB?: LineElementArrow;
}

interface BitmapBase extends Element2dBase {
    cropX: number;
    cropY: number;
    cropW: number;
    cropH: number;
    angle: number;
    dibHandle: number;
}

export interface BitmapElement extends BitmapBase {
    type: "bitmap";
}

export interface DoubleBitmapElement extends BitmapBase {
    type: "doubleBitmap";
}

export interface TextElement extends Element2dBase {
    type: "text";
    textToolHandle: number;
    delta: Point2D;
    angle: number;
}

export interface ControlElement extends Element2dBase {
    type: "control";
    inputType: "EDIT" | "BUTTON" | "COMBOBOX";
    text: string;
    dwStyle: number;
    exStyle: number;
    id: number;
    controlSize: Point2D;
}

export interface View3D extends Element2dBase {
    type: "view3D";
    spaceHandle: number;
    cameraHandle: number;
}

export interface EditFrame extends Element2dBase {
    type: "editFrame";
    objectHandle: number;
    size: Point2D;
}

export type VectorDrawingElement2d = LineElement | BitmapElement | DoubleBitmapElement | TextElement | ControlElement | View3D;
export type VectorDrawingElement = VectorDrawingElement2d | GroupElement;
