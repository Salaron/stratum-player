import { DibToolImage } from "stratum/fileFormats/bmp/dibToolImage";
import { BinaryReader } from "stratum/helpers/binaryReader";

type BlobType = "image/jpeg" | "image/bmp" | "image/png" | "image/gif";

export interface DibToolImageExtended {
    img: DibToolImage;
    transparent: boolean;
}

export function readImageFile(reader: BinaryReader, ext: string): Promise<DibToolImageExtended> {
    let type: BlobType;
    let transparent: boolean;
    switch (ext) {
        case "jpg":
        case "jpeg":
            type = "image/jpeg";
            transparent = false;
            break;
        case "gif":
            type = "image/gif";
            transparent = true;
            break;
        case "png":
            type = "image/png";
            transparent = true;
            break;
        case "tga":
            throw Error("Изображения типа tga не поддерживаются");
        default:
            type = "image/bmp";
            transparent = false;
            break;
    }

    const arrayBufferView = new Uint8Array(reader.buffer());
    const blob = new Blob([arrayBufferView], { type });
    const urlCreator = window.URL ?? window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);

    return new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => {
            const cnv = document.createElement("canvas");
            cnv.width = img.width;
            cnv.height = img.height;
            const ctx = cnv.getContext("2d")!;
            ctx.drawImage(img, 0, 0);
            res({ img: ctx, transparent });
        };
        img.onerror = () => {
            rej();
        };
        img.src = imageUrl;
    });
}