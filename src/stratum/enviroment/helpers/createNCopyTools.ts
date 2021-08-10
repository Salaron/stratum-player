import { SceneWrapper } from "stratum/enviroment/sceneWrapper";
import { BrushToolParams, FontToolParams, ImageToolParams, PenToolParams, StringToolParams, TextToolParams } from "stratum/fileFormats/vdr";
import { Scene } from "stratum/graphics/scene";
import { BrushTool, BrushToolArgs } from "stratum/graphics/tools/brushTool";
import { FontTool, FontToolArgs } from "stratum/graphics/tools/fontTool";
import { ImageTool, ImageToolArgs } from "stratum/graphics/tools/imageTool";
import { PenTool, PenToolArgs } from "stratum/graphics/tools/penTool";
import { StringTool, StringToolArgs } from "stratum/graphics/tools/stringTool";
import { TextTool, TextToolArgs, TextToolPartData } from "stratum/graphics/tools/textTool";
import { HandleMap } from "stratum/helpers/handleMap";
import { graphicsImpl } from "../toolsAndElementsConstructors";

export function createPenTools(scene: Scene, tools?: PenToolParams[]): Map<number, PenTool> {
    const arr = tools?.map<[number, PenTool]>((t) => {
        const args: PenToolArgs = {
            handle: t.handle,
            color: t.color,
            rop: t.rop2,
            style: t.style,
            width: t.width,
        };
        return [t.handle, new graphicsImpl.pen(scene, args)];
    });
    return new Map(arr);
}

export function copyPen(w: SceneWrapper, pen: PenTool): PenTool {
    const handle = HandleMap.getFreeHandle(w.pens);
    const copy = new graphicsImpl.pen(w.scene, {
        handle,
        color: pen.color(),
        rop: pen.rop(),
        style: pen.style(),
        width: pen.width(),
    });
    w.pens.set(handle, copy);
    return copy;
}

export function createBrushTools(scene: Scene, dibs: Map<number, ImageTool>, tools?: BrushToolParams[]): Map<number, BrushTool> {
    const arr = tools?.map<[number, BrushTool]>((t) => {
        const args: BrushToolArgs = {
            handle: t.handle,
            color: t.color,
            rop: t.rop2,
            style: t.style,
            hatch: t.handle,
            image: dibs.get(t.dibHandle),
        };
        return [t.handle, new graphicsImpl.brush(scene, args)];
    });
    return new Map(arr);
}

export function copyBrush(w: SceneWrapper, brush: BrushTool): BrushTool {
    const img = brush.image.tool();

    const handle = HandleMap.getFreeHandle(w.brushes);
    const copy = new graphicsImpl.brush(w.scene, {
        handle,
        color: brush.color(),
        hatch: brush.hatch(),
        rop: brush.rop(),
        style: brush.style(),
        image: img ? copyImageTool(w, w.dibs, img) : null,
    });
    w.brushes.set(handle, copy);
    return copy;
}

export function createImageTools(scene: Scene, tools?: ImageToolParams[]): Map<number, ImageTool> {
    const arr = tools?.map<[number, ImageTool]>((t) => {
        const img = t.type === "image" ? t.img : null; //WIP сделать класс загрузки иконок.
        const args: ImageToolArgs = {
            handle: t.handle,
        };
        return [t.handle, new graphicsImpl.dib(scene, img, args)];
    });
    return new Map(arr);
}

export function copyImageTool(w: SceneWrapper, tools: Map<number, ImageTool>, img: ImageTool): ImageTool {
    const handle = HandleMap.getFreeHandle(tools);
    // fixme: клонировать канвас
    const copy = new graphicsImpl.dib(w.scene, img.img(), { handle });
    tools.set(handle, copy);
    return copy;
}

export function createFontTools(scene: Scene, tools?: FontToolParams[]): Map<number, FontTool> {
    const arr = tools?.map<[number, FontTool]>((t) => {
        const args: FontToolArgs = {
            handle: t.handle,
            name: t.fontName,
            style: (t.italic ? 1 : 0) | (t.underline ? 2 : 0) | (t.strikeOut ? 4 : 0) | (t.weight ? 8 : 0),
        };
        return [t.handle, new graphicsImpl.font(scene, t.height < 0 ? t.height * -1 : t.height, args)];
    });
    return new Map(arr);
}

export function copyFontTool(w: SceneWrapper, font: FontTool): FontTool {
    const handle = HandleMap.getFreeHandle(w.fonts);
    const copy = new graphicsImpl.font(w.scene, font.size(), {
        handle,
        name: font.name(),
        style: font.style(),
    });
    w.fonts.set(handle, copy);
    return copy;
}

export function createStringTools(scene: Scene, tools?: StringToolParams[]): Map<number, StringTool> {
    const arr = tools?.map<[number, StringTool]>((t) => {
        const args: StringToolArgs = { handle: t.handle };
        return [t.handle, new graphicsImpl.str(scene, t.text, args)];
    });
    return new Map(arr);
}

export function copyStringTool(w: SceneWrapper, str: StringTool): StringTool {
    const handle = HandleMap.getFreeHandle(w.strings);
    const copy = new graphicsImpl.str(w.scene, str.text(), { handle });
    w.strings.set(handle, copy);
    return copy;
}

export function createTextTools(scene: Scene, fonts: Map<number, FontTool>, strings: Map<number, StringTool>, tools?: TextToolParams[]): Map<number, TextTool> {
    const arr = tools?.map<[number, TextTool]>((t) => {
        const parts = t.textCollection.map<TextToolPartData>((c) => {
            const font = fonts.get(c.fontHandle);
            if (!font) throw Error(`Инструмент Шрифт #${c.fontHandle} не найден`);
            const str = strings.get(c.stringHandle);
            if (!str) throw Error(`Инструмент Строка #${c.stringHandle} не найден`);
            return { fgColor: c.fgColor, bgColor: c.bgColor, font, str };
        });
        const args: TextToolArgs = { handle: t.handle };
        return [t.handle, new graphicsImpl.ttool(scene, parts, args)];
    });
    return new Map(arr);
}

export function copyTextTool(w: SceneWrapper, text: TextTool): TextTool {
    const handle = HandleMap.getFreeHandle(w.texts);

    const data: TextToolPartData[] = text.parts().map((t) => ({
        font: copyFontTool(w, t.font.tool()),
        str: copyStringTool(w, t.str.tool()),
        fgColor: t.fgColor(),
        bgColor: t.bgColor(),
    }));

    const copy = new graphicsImpl.ttool(w.scene, data, { handle });
    w.texts.set(handle, copy);
    return copy;
}
