declare module "vdr-types" {
    export interface Point2D {
        x: number;
        y: number;
    }

    interface _ToolDataBase {
        handle: number;
    }

    export interface BrushToolData extends _ToolDataBase {
        type: "ttBRUSH2D";
        color: number;
        style: number;
        hatch: number;
        rop2: number;
        dibHandle: number;
    }

    export interface PenToolData extends _ToolDataBase {
        type: "ttPEN2D";
        color: number;
        style: number;
        width: number;
        rop2: number;
    }

    export interface FontToolData extends _ToolDataBase {
        type: "ttFONT2D";
        height: number;
        width: number;
        escapement: number;
        orientation: number;
        weight: number;
        italic: number;
        underline: number;
        strikeOut: number;
        charSet: number;
        outPrecision: number;
        clipPrecision: number;
        quality: number;
        pitchAndFamily: number;
        fontName: string;
        size: number;
        style: number;
    }

    export interface StringToolData extends _ToolDataBase {
        type: "ttSTRING2D";
        text: string;
    }

    export interface TextToolData extends _ToolDataBase {
        type: "ttTEXT2D";
        textCollection: {
            foregroundColor: number;
            backgroundColor: number;
            fontHandle: number;
            stringHandle: number;
        }[];
    }

    export interface BitmapToolData extends _ToolDataBase {
        type: "ttDIB2D";
        image: string;
        width: number;
        height: number;
    }

    export interface DoubleBitmapToolData extends _ToolDataBase {
        type: "ttDOUBLEDIB2D";
        image: string;
        width: number;
        height: number;
    }

    export interface ExternalBitmapToolData extends _ToolDataBase {
        type: "ttREFTODIB2D";
        filename: string;
    }

    export interface ExternalDoubleBitmapToolData extends _ToolDataBase {
        type: "ttREFTODOUBLEDIB2D";
        filename: string;
    }

    export type ImageToolData =
        | BitmapToolData
        | DoubleBitmapToolData
        | ExternalBitmapToolData
        | ExternalDoubleBitmapToolData;

    export type ToolData = BrushToolData | PenToolData | FontToolData | StringToolData | TextToolData | ImageToolData;

    export interface ElementBaseData {
        handle: number;
        options: number;
        name: string;
    }

    export interface Element2dBaseData extends ElementBaseData {
        position: Point2D;
        size: Point2D;
    }

    export interface GroupElementData extends ElementBaseData {
        type: "otGROUP2D";
        childHandles: number[];
    }

    export interface LineElementData extends Element2dBaseData {
        type: "otLINE2D";
        penHandle: number;
        brushHandle: number;
        points: Point2D[];
        arrows?: Uint8Array;
    }

    interface _BitmapBaseData extends Element2dBaseData {
        bmpOrigin: Point2D;
        bmpSize: Point2D;
        bmpAngle: number;
    }

    export interface BitmapElementData extends _BitmapBaseData {
        type: "otBITMAP2D";
        bmpHandle: number;
    }

    export interface DoubleBitmapElementData extends _BitmapBaseData {
        type: "otDOUBLEBITMAP2D";
        bmpHandle: number;
    }

    export interface TextElementData extends Element2dBaseData {
        type: "otTEXT2D";
        textToolHandle: number;
        delta: number;
        angle: number;
    }

    export interface ControlElementData extends Element2dBaseData {
        type: "otCONTROL2D";
        classname: "Edit" | "Button" | "ComboBox";
        text: string;
        dwStyle: number;
        exStyle: number;
        id: number;
        controlSize: Point2D;
    }

    export type Element2dData =
        | LineElementData
        | BitmapElementData
        | DoubleBitmapElementData
        | TextElementData
        | ControlElementData;

    export type ElementData = Element2dData | GroupElementData;

    export interface VectorDrawToolsData {
        brushTools?: BrushToolData[];
        penTools?: PenToolData[];
        bitmapTools?: ImageToolData[];
        doubleBitmapTools?: ImageToolData[];
        fontTools?: FontToolData[];
        stringTools?: StringToolData[];
        textTools?: TextToolData[];
    }

    export interface VectorDrawData extends VectorDrawToolsData {
        origin: Point2D;
        brushHandle?: number;
        state: number;
        defaultFlags: number;
        fileversion: number;
        layers: number;
        minVersion: number;
        elements?: ElementData[];
        elementOrder?: number[];
    }
}
