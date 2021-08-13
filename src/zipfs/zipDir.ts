import { FileInfo, PathInfo } from "stratum";
import { PathObject } from "./pathObject";
import { RealZipFS } from "./realZipfs";
import { LazyBuffer, ZipFile } from "./zipFile";

const pathErr = (path: PathInfo) => Error(`Невозможно создать каталог ${path.toString()} - по этому пути уже существует файл.`);
export class ZipDir implements FileInfo {
    readonly isDir = true;
    private readonly nodes = new Map<string, ZipDir | ZipFile>();
    // private readonly fs: ZipFS;

    // readonly path: string;
    readonly pinfo: PathObject;

    readonly fs: RealZipFS;

    readonly _date = new Date();

    constructor(private localName: string, readonly parent: RealZipFS | ZipDir) {
        if (parent instanceof ZipDir) {
            // this.fs = parent.fs;
            // this._parent = parent;
            // this.path = parent.path + "\\" + localName;
            this.pinfo = parent.pinfo.child(localName);
            this.fs = parent.fs;
        } else {
            // this.fs = parent;
            // this._parent = this;
            // assertDiskPrefix(localName);
            // this.path = this.localName = localName + ":";
            this.pinfo = new PathObject(parent, localName);
            this.fs = parent;
        }
    }

    path(): PathObject {
        return this.pinfo;
    }

    size(): number {
        return 0;
    }

    date(): Date {
        return this._date;
    }

    getDir(path: ReadonlyArray<string>): ZipDir | null {
        if (path.length === 0) return this;
        let dir: ZipDir = this;
        for (let i = 0; i < path.length - 1; ++i) {
            const next = dir.nodes.get(path[i].toUpperCase());
            if (!next?.isDir) return null;
            dir = next;
        }
        return dir;
    }

    getFileOrDir(path: ReadonlyArray<string>): ZipDir | ZipFile | null {
        if (path.length === 0) return this;
        return this.getDir(path)?.nodes.get(path[path.length - 1].toUpperCase()) ?? null;
    }

    // create(type: "file", path: string, data?: ArrayBuffer): VFSFile | undefined;
    // create(type: "dir", path: string): VFSDir | undefined;
    // create(type: "file" | "dir", path: string, data?: ArrayBuffer): VFSFile | VFSDir | undefined {
    //     const pp = splitPath(path);
    //     if (type === "dir") {
    //         return this.resolve(pp, true);
    //     }

    //     const basePath = pp.slice(0, pp.length - 1);
    //     const localName = pp[pp.length - 1];

    //     const where = this.resolve(basePath);
    //     if (!where?.isDir) return undefined;

    //     const keyUC = localName.toUpperCase();

    //     const existingNode = where.nodes.get(keyUC);
    //     if (existingNode?.isDir) return undefined;

    //     const f = new VFSFile(localName, where, data ?? new ArrayBuffer(0));
    //     where.nodes.set(keyUC, f);
    //     return f;
    // }

    createLocalFile(localName: string, source: LazyBuffer): ZipFile {
        const f = new ZipFile(localName, this, source);

        const prv = this.nodes.size;
        this.nodes.set(localName.toUpperCase(), f);
        if (this.nodes.size === prv) throw Error(`Конфликт имен: ${f.pinfo.toString()}`);

        return f;
    }

    createFile(localName: string, source: LazyBuffer): ZipFile {
        const f = new ZipFile(localName, this, source);

        const nodeID = localName.toUpperCase();
        if (this.nodes.get(nodeID)?.isDir) throw Error(`Каталог существует: ${f.pinfo.toString()}`);
        this.nodes.set(nodeID, f);

        return f;
    }

    createLocalDir(name: string): ZipDir {
        const keyUC = name.toUpperCase();

        const node = this.nodes.get(keyUC);
        if (node) {
            if (node.isDir) return node;
            throw pathErr(node.pinfo);
        }
        const d = new ZipDir(name, this);
        this.nodes.set(keyUC, d);
        return d;
    }

    merge({ nodes: otherNodes }: ZipDir): this {
        const { nodes: myNodes } = this;
        for (const [otherNameUC, otherNode] of otherNodes) {
            let thisNode = myNodes.get(otherNameUC);
            if (thisNode && !thisNode.isDir) throw pathErr(thisNode.pinfo);
            if (otherNode.isDir) {
                if (!thisNode) {
                    thisNode = new ZipDir(otherNode.localName, this);
                    myNodes.set(otherNameUC, thisNode);
                }
                thisNode.merge(otherNode);
                continue;
            }
            if (thisNode) throw pathErr(thisNode.pinfo);
            myNodes.set(otherNameUC, otherNode.hardlink(this));
        }
        return this;
    }

    *files(regexp?: RegExp, recursive: boolean = true): IterableIterator<PathInfo> {
        for (const node of this.nodes.values()) {
            if (node.isDir) {
                if (recursive) yield* node.files(regexp, true);
                continue;
            }
            if (!regexp || regexp.test(node.pinfo.toString())) yield node.pinfo;
        }
    }

    *list(regexp: RegExp): IterableIterator<FileInfo> {
        // FIXME: сделать лучше
        if (regexp.test(this.pinfo.toString() + "\\" + ".")) yield new ZipDir(".", this);
        if (regexp.test(this.pinfo.toString() + "\\" + "..")) yield new ZipDir("..", this);
        for (const node of this.nodes.values()) {
            if (node.isDir) {
                yield* node.list(regexp);
            }
            if (regexp.test(node.pinfo.toString())) yield node;
        }
    }
}
