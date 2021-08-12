import { readDbmFile } from "stratum/fileFormats/bmp";
import { DibToolImage } from "stratum/fileFormats/bmp/dibToolImage";
import { BinaryReader } from "stratum/helpers/binaryReader";

type BlobType = "image/jpeg" | "image/bmp" | "image/png" | "image/gif";

export interface DibToolImageExtended {
    img: DibToolImage;
    transparent: boolean;
}

export function readImageFile(reader: BinaryReader, maybeTransparent: boolean): Promise<DibToolImageExtended> {
    const _pos = reader.pos();
    const sign = reader.uint16();
    reader.seek(_pos);

    let type: BlobType;
    let transparent: boolean;
    switch (sign) {
        case 0xd8ff:
            type = "image/jpeg";
            transparent = false;
            break;
        case 0x4947:
            type = "image/gif";
            transparent = true;
            break;
        case 0x5089:
            type = "image/png";
            transparent = true;
            break;
        case 0x0000:
            throw Error("Изображения типа tga не поддерживаются");
        case 0x4d42: {
            if (maybeTransparent) {
                const res: DibToolImageExtended = {
                    transparent: true,
                    img: readDbmFile(reader),
                };
                return Promise.resolve(res);
            }
            type = "image/bmp";
            transparent = false;
            break;
        }
        default:
            throw Error(`Неизвестная сигнатура: ${sign}`);
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
