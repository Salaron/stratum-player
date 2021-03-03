// class.cpp:6100
import { BinaryStream, FileReadingError, FileSignatureError } from "stratum/helpers/binaryStream";
import { EntryCode } from "./entryCode";
import { readVdrFile, VectorDrawing } from "./vdr";

export type BytecodeParser<TVmCode> = (bytes: Uint8Array) => TVmCode;

export interface ClassVar {
    name: string;
    description: string;
    defaultValue: string;
    type: "STRING" | "FLOAT" | "INTEGER" | "HANDLE" | "COLORREF";
    flags: number;
}

export interface ClassLink {
    handle1: number;
    handle2: number;
    contactPadHandle: number;
    linkHandle: number;
    connectedVars: { name1: string; name2: string }[];
    flags: number;
}

export interface ClassChild {
    classname: string;
    schemeInfo: {
        handle: number;
        name: string;
        position: { x: number; y: number };
    };
    // flag =  0 | stream.bytes(1)[0];
    flags: number;
}

export interface ClassInfoHeader {
    name: string;
    version: number;
}

export interface ClassInfoBody<VmCode> {
    vars?: ClassVar[];
    links?: ClassLink[];
    children?: ClassChild[];
    scheme?: VectorDrawing;
    image?: VectorDrawing;
    code?: VmCode;
    iconFile?: string;
    iconIndex?: number;
    sourceCode?: string;
    description?: string;
    varsize?: number;
    flags?: number;
    classId?: number;
    date?: Date;
}

function readVars(stream: BinaryStream): ClassVar[] {
    const varCount = stream.uint16();

    const vars = new Array<ClassVar>(varCount);
    for (let i = 0; i < varCount; i++) {
        const name = stream.string();
        const description = stream.string();
        const defaultValue = stream.string();
        const readedType = stream.string().toUpperCase();
        if (readedType !== "STRING" && readedType !== "FLOAT" && readedType !== "INTEGER" && readedType !== "HANDLE" && readedType !== "COLORREF") {
            throw new FileReadingError(stream, `неизвестный тип переменной: ${readedType}.`);
        }
        const flags = stream.int32();
        vars[i] = { name, description, defaultValue, type: readedType, flags };
    }
    //RETURN VALUE - (v.flags & 1024)
    return vars;
}

function readLinks(stream: BinaryStream): ClassLink[] {
    const linkCount = stream.uint16();

    const links = new Array<ClassLink>(linkCount);
    for (let i = 0; i < linkCount; i++) {
        const handle1 = stream.uint16();
        const handle2 = stream.uint16();
        const linkHandle = stream.uint16();
        const flags = stream.int32();
        const count = stream.uint16();
        const contactPadHandle = stream.uint16();

        const connectedVars = new Array<{ name1: string; name2: string }>(count);
        for (let j = 0; j < count; j++) {
            const name1 = stream.string();
            const name2 = stream.string();
            connectedVars[j] = { name1, name2 };
        }
        links[i] = { handle1, handle2, linkHandle, flags, connectedVars, contactPadHandle };
    }
    return links;
}

function readChildren(stream: BinaryStream): ClassChild[] {
    const childCount = stream.uint16();

    const children = new Array<ClassChild>(childCount);
    for (let i = 0; i < childCount; i++) {
        const classname = stream.string();
        const handle = stream.uint16();
        const name = stream.string();

        //class.cpp:5952
        if (!stream.version) throw Error("filversion?");
        const position = stream.version < 0x3002 ? stream.point2dInt() : stream.point2d();

        // const flag =  0 | stream.bytes(1)[0];
        const flags = stream.byte();
        children[i] = { classname, schemeInfo: { handle, name, position }, flags };
    }
    return children;
}

function readVdr(stream: BinaryStream, classname: string, type: "Схема" | "Изображение") {
    const fmt = `${type} ${classname} (${stream.name || "?"})`;
    const flags = stream.int32();
    if (flags & EntryCode.SF_EXTERNAL) {
        const filename = stream.string();
        console.warn(`${fmt}: ошибка чтения. Причина: чтение внешних VDR (${filename}) не реализовано.`);
        return undefined;
    }

    const data = stream.bytes(stream.int32());
    try {
        return readVdrFile(new BinaryStream({ data, name: fmt }), { origin: "class", name: classname });
    } catch (e) {
        console.warn(`${fmt}): ошибка чтения.\nПричина: ${e.message}`);
        return undefined;
    }
}

// const EC_VAR = 16384;
// const EC_CONST = 0;
// function readEquations(stream: BinaryStream) {
//     const code = stream.uint16();

//     if (code === EC_VAR) {
//         const index = stream.uint16();
//         const eqflag = stream.uint16();
//     }

//     if (code === EC_CONST) {
//         const value = stream.bytes(8);
//     }

//     let byte;
//     while ((byte = stream.bytes(1)[0])) readEquations(stream);
// }

export function readClsFileHeader(stream: BinaryStream): ClassInfoHeader {
    const sign = stream.uint16();
    if (sign !== 0x4253) throw new FileSignatureError(stream, sign, 0x4253);

    const version = stream.int32();
    stream.int32(); //magic1
    stream.int32(); //magic2
    const name = stream.string();

    return { name, version };
}

export function readClsFileBody<VmCode>(
    stream: BinaryStream,
    classname: string,
    blocks: {
        readScheme?: boolean;
        readImage?: boolean;
        parseBytecode?: BytecodeParser<VmCode>;
    }
): ClassInfoBody<VmCode> {
    const res: ClassInfoBody<VmCode> = {};

    let next = stream.uint16();
    if (next === EntryCode.CR_VARS1) {
        res.vars = readVars(stream);
        next = stream.uint16();
    }

    if (next === EntryCode.CR_LINKS) {
        res.links = readLinks(stream);
        next = stream.uint16();
    }

    if (next === EntryCode.CR_CHILDSnameXY || next === EntryCode.CR_CHILDSname || next === EntryCode.CR_CHILDS) {
        res.children = readChildren(stream);
        next = stream.uint16();
    }

    if (next === EntryCode.CR_ICON) {
        const iconSize = stream.int32();
        stream.skip(iconSize - 4);
        // res.icon = stream.bytes(iconSize - 4);
        next = stream.uint16();
    }

    if (next === EntryCode.CR_SCHEME) {
        const blockSize = stream.int32();
        if (!blocks.readScheme) stream.skip(blockSize - 4);
        else res.scheme = readVdr(stream, classname, "Схема");
        next = stream.uint16();
    }

    if (next === EntryCode.CR_IMAGE) {
        const blockSize = stream.int32();
        if (!blocks.readImage) stream.skip(blockSize - 4);
        else res.image = readVdr(stream, classname, "Изображение");
        next = stream.uint16();
    }

    if (next === EntryCode.CR_TEXT) {
        res.sourceCode = stream.string();
        next = stream.uint16();
    }

    if (next === EntryCode.CR_INFO) {
        res.description = stream.string();
        next = stream.uint16();
    }

    if (next === EntryCode.CR_VARSIZE) {
        res.varsize = stream.uint16();
        next = stream.uint16();
    }

    if (next === EntryCode.CR_FLAGS) {
        res.flags = stream.int32();
        next = stream.uint16();
    }

    if (next === EntryCode.CR_DEFICON) {
        res.iconIndex = stream.uint16();
        next = stream.uint16();
    }

    if (next === EntryCode.CR_ICONFILE) {
        res.iconFile = stream.string();
        next = stream.uint16();
    }

    if (next === EntryCode.CR_CODE) {
        const codesize = stream.int32() * 2;

        if (blocks.parseBytecode !== undefined) {
            const raw = stream.bytes(codesize);
            try {
                res.code = blocks.parseBytecode(raw);
            } catch (e) {
                console.warn(`Байткод ${classname} (${stream.name || "?"}): ошибка чтения.\nПричина: ${e.message}`);
            }
        } else {
            stream.skip(codesize);
        }
        next = stream.uint16();
    }

    if (next === EntryCode.CR_EQU) {
        console.warn(`${classname} (${stream.name || "?"}):\nУравнения не поддерживаются.`);
        return res;
    }

    if (next !== EntryCode.CR_CLASSTIME && stream.version === 0x3003) {
        console.warn(`${classname} (${stream.name || "?"}: тут что-то не так...`);
    }

    // let classId = stream.int32();
    // res.classId = classId;

    // const BITS4 = 0b0001111;
    // const BITS5 = 0b0011111;
    // const BITS6 = 0b0111111;
    // const BITS7 = 0b1111111;

    // const sec = classId & BITS5;
    // const min = (classId >>= 5) & BITS6;
    // const hour = (classId >>= 6) & BITS5;
    // const day = (classId >>= 5) & BITS5;
    // const month = (classId >>= 5) & BITS4;
    // const year = ((classId >>= 4) & BITS7) + 1996;

    // res.date = new Date(year, month, day, hour, min, sec);
    return res;
}
