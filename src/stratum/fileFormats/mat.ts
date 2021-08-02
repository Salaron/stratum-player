import { BinaryReader, FileSignatureError } from "stratum/helpers/binaryReader";

export interface FloatMatrix {
    minV: number;
    minH: number;
    rows: number;
    cols: number;
    data: number[];
}

// matrix.cpp:70
export function readMatFile(reader: BinaryReader): FloatMatrix {
    // const sizeofDouble = 8;
    const sign = reader.uint16();
    if (sign !== 0x0c) throw new FileSignatureError(reader, sign, 0x0c);
    reader.seek(14);
    const rows = reader.int32();
    const cols = reader.int32();
    const minV = reader.int32();
    const minH = reader.int32();
    // reader.uint16(); //type
    // reader.uint16(); //должен быть 0
    reader.skip(4);
    const data = Array.from({ length: rows * cols }, () => reader.float64());
    return { minV, minH, rows, cols, data };
}
