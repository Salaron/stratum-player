import { readDbmFile } from "stratum/fileFormats/bmp";
import { DibToolImage } from "stratum/fileFormats/bmp/dibToolImage";
import { FloatMatrix, readMatFile } from "stratum/fileFormats/mat";
import { ProjectInfo, readPrjFile } from "stratum/fileFormats/prj";
import { readSttFile, VariableSet } from "stratum/fileFormats/stt";
import { readVdrFile, VectorDrawing } from "stratum/fileFormats/vdr";
import { BinaryReader } from "stratum/helpers/binaryReader";
import { PathInfo } from "stratum/stratum";
import { DibToolImageExtended, readImageFile } from "./readImageFile";

export function readFile(file: PathInfo, type: "prj"): Promise<ProjectInfo>;
export function readFile(file: PathInfo, type: "stt"): Promise<VariableSet>;
export function readFile(file: PathInfo, type: "vdr"): Promise<VectorDrawing>;
export function readFile(file: PathInfo, type: "mat"): Promise<FloatMatrix>;
export function readFile(file: PathInfo, type: "bmp"): Promise<DibToolImageExtended>;
export function readFile(file: PathInfo, type: "dbm"): Promise<DibToolImage>;
export async function readFile(
    file: PathInfo,
    type: "prj" | "stt" | "vdr" | "mat" | "bmp" | "dbm"
): Promise<ProjectInfo | VariableSet | VectorDrawing | FloatMatrix | DibToolImage | DibToolImageExtended | null> {
    const path = file.toString();
    const buf = await file.fs.arraybuffer(file);
    if (!buf) throw Error(`Файл ${path} не существует.`);
    const r = new BinaryReader(buf, path);
    try {
        switch (type) {
            case "prj":
                return readPrjFile(r);
            case "stt":
                return readSttFile(r);
            case "vdr":
                return readVdrFile(r, { origin: "file", name: file.toString() });
            case "mat":
                return readMatFile(r);
            case "bmp": {
                const ext = path.substring(path.lastIndexOf(".") + 1);
                return readImageFile(r, ext);
            }
            case "dbm":
                return readDbmFile(r);
        }
    } catch (err) {
        console.warn(`Ошибка чтения ${file.toString()} как .${type.toUpperCase()}`);
        console.error(err);
        throw err;
    }
}
