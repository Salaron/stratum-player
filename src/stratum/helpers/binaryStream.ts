import { Point2D } from "./types";
import { decode } from "./win1251";

export interface FlushCallback {
    (data: ArrayBuffer): void;
}

export interface BinaryStreamOptions {
    data?: ArrayBuffer | ArrayBufferView;
    canWrite?: boolean;
    canRead?: boolean;
    onflush?: FlushCallback;
    name?: string;
    version?: number;
}

export class BinaryStream {
    // private static d = new TextDecoder("windows-1251");

    private v: DataView;
    private p: number;
    private canWrite: boolean;
    private canRead: boolean;
    private onflush: FlushCallback | null;

    readonly name: string;
    version: number;

    constructor(opts: BinaryStreamOptions = {}) {
        const d = opts.data;
        const cw = opts.canWrite ?? false;
        if (!d) {
            this.v = new DataView(new ArrayBuffer(0));
        } else if (d instanceof ArrayBuffer) {
            this.v = new DataView(cw ? d.slice(0) : d);
        } else if (cw) {
            const copy = d.buffer.slice(d.byteOffset, d.byteOffset + d.byteLength);
            this.v = new DataView(copy);
        } else {
            this.v = new DataView(d.buffer, d.byteOffset, d.byteLength);
        }
        this.p = 0;

        this.canWrite = cw;
        this.canRead = opts.canRead ?? true;
        this.onflush = opts.onflush ?? null;
        this.name = opts.name ?? "";
        this.version = opts.version ?? 0;
    }

    pos(): number {
        return this.p;
    }

    seek(pos: number): this {
        this.p = pos;
        return this;
    }

    skip(len: number): this {
        this.p += len;
        return this;
    }

    size(): number {
        return this.v.byteLength;
    }

    eof(): boolean {
        return this.p >= this.size();
    }

    bytes(size: number): Uint8Array {
        const bytes = new Uint8Array(this.v.buffer, this.v.byteOffset + this.p, size);
        this.p += size;
        return bytes;
    }

    byte(): number {
        const byte = this.v.getUint8(this.p);
        this.p += 1;
        return byte;
    }

    int16(): number {
        const word = this.v.getInt16(this.p, true);
        this.p += 2;
        return word;
    }

    uint16(): number {
        const word = this.v.getUint16(this.p, true);
        this.p += 2;
        return word;
    }

    int32(): number {
        const long = this.v.getInt32(this.p, true);
        this.p += 4;
        return long;
    }

    uint32(): number {
        const long = this.v.getUint32(this.p, true);
        this.p += 4;
        return long;
    }

    float64(): number {
        const double = this.v.getFloat64(this.p, true);
        this.p += 8;
        return double;
    }

    fixedString(size: number): string {
        return size > 0 ? decode(this.bytes(size)) : "";
    }

    // Обычная строка вида:
    // 2 байта - размер (N);
    // N байтов - содержимое.
    string(): string {
        return this.fixedString(this.uint16());
    }

    /**
     * Нуль-терминированная строка.
     * Максимальный размер строки будет составлять `limit - 1` байт.
     */
    nulltString(limit?: number): string {
        const l = limit ?? this.size() - this.p;
        const strStart = this.p;
        let size = 0;
        while (size < l - 1 && this.v.getUint8(strStart + ++size) !== 0);

        const value = this.fixedString(size);
        this.p += 1; //нуль-терминатор
        return value;
    }

    //Используется в коде ВМ, где количество байт всегда кратно 2
    vmString(): string {
        const size = this.uint16() * 2;

        //после строки может идти 1 или 2 нуль-терминатора.
        const nullt = this.v.getUint8(this.p + size - 2) === 0 ? 2 : 1;

        const value = this.fixedString(size - nullt);
        this.p += nullt;
        return value;
    }

    point2d(): Point2D {
        return {
            x: this.float64(),
            y: this.float64(),
        };
    }

    point2dInt(): Point2D {
        return {
            x: this.int16(),
            y: this.int16(),
        };
    }
    close() {
        if (this.onflush) this.onflush(this.v.buffer);
    }
}

export class FileReadingError extends Error {
    constructor(stream: BinaryStream, message: string) {
        super(`Ошибка чтения ${stream.name || ""}:\n${message}`);
    }
}

export class FileSignatureError extends FileReadingError {
    constructor(stream: BinaryStream, signature: number, expected: number) {
        super(stream, `Сигнатура: 0x${signature.toString(16)}, ожидалось 0x${expected.toString(16)}.`);
    }
}
