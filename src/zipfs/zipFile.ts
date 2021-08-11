import { JSZipObject } from "jszip";
import { FileInfo, ReadWriteFile } from "stratum";
import { PathObject } from "./pathObject";
import { ZipDir } from "./zipDir";

export type LazyBuffer = JSZipObject | ArrayBuffer;

export class ZipFile implements ReadWriteFile, FileInfo {
    readonly isDir = false;
    private buf: LazyBuffer;
    // readonly path: string;
    readonly pinfo: PathObject;

    readonly _date: Date;

    constructor(private localName: string, readonly parent: ZipDir, src: LazyBuffer) {
        this.buf = src;
        // this.path = parent.path + "\\" + localName;
        this.pinfo = parent.pinfo.child(localName);
        this._date = src instanceof ArrayBuffer ? new Date() : src.date;
    }

    path(): PathObject {
        return this.pinfo;
    }

    size(): number {
        if (this.buf instanceof ArrayBuffer) return this.buf.byteLength;
        return (this.buf as any)["_data"]["uncompressedSize"];
    }

    date(): Date {
        return this._date;
    }

    hardlink(parent: ZipDir, newLocalName?: string) {
        return new ZipFile(newLocalName || this.localName, parent, this.buf);
    }

    async read(): Promise<ArrayBuffer> {
        if (this.buf instanceof ArrayBuffer) return this.buf;
        return (this.buf = await this.buf.async("arraybuffer"));
    }

    async write(data: ArrayBuffer): Promise<boolean> {
        this.buf = data;
        const promises = [...this.parent.fs._updateHandlers].map((h) => h(this.pinfo, data));
        try {
            await Promise.all(promises);
            return true;
        } catch {
            return false;
        }
    }
}
