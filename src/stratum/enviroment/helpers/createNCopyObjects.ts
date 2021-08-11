import { VectorDrawingElement } from "stratum/fileFormats/vdr";
import { HardHiddenVisibilityComponent } from "stratum/graphics/components/hardHiddenVisibilityComponent";
import { UnSelectableComponent } from "stratum/graphics/components/unselectableComponent";
import { VisibilityComponent } from "stratum/graphics/components/visibilityComponent";
import { GroupElement2D, GroupElement2DArgs } from "stratum/graphics/elements/groupElement2d";
import { ImageElement2DArgs } from "stratum/graphics/elements/imageElement2d";
import { InputElement2DArgs } from "stratum/graphics/elements/inputElement2d";
import { LineElement2DArgs } from "stratum/graphics/elements/lineElement2d";
import { TextElement2DArgs } from "stratum/graphics/elements/textElement2d";
import { PrimaryElement, Scene } from "stratum/graphics/scene";
import { BrushTool } from "stratum/graphics/tools/brushTool";
import { ImageTool } from "stratum/graphics/tools/imageTool";
import { PenTool } from "stratum/graphics/tools/penTool";
import { TextTool } from "stratum/graphics/tools/textTool";
import { HandleMap } from "stratum/helpers/handleMap";
import { SceneElement, SceneWrapper } from "../sceneWrapper";
import { graphicsImpl } from "../toolsAndElementsConstructors";
import { createArrow } from "./createArrow";
import { copyBrush, copyFontTool, copyImageTool, copyPen, copyTextTool } from "./createNCopyTools";

function parseHardHidden(opts: number): boolean {
    return !!(opts & 1);
}

function parseSeleсtable(opts: number): boolean {
    return !(opts & 8);
}

function parseLayer(opts: number): number {
    const layerNumber = (opts >> 8) & 0b11111;
    return 1 << layerNumber;
}

export interface EnviromentElementsTools {
    pens: Map<number, PenTool>;
    brushes: Map<number, BrushTool>;
    dibs: Map<number, ImageTool>;
    doubleDibs: Map<number, ImageTool>;
    texts: Map<number, TextTool>;
}

export function createElements(scene: Scene, tools: EnviromentElementsTools, elements?: VectorDrawingElement[]): Map<number, SceneElement> {
    const groups = new Set<{ g: GroupElement2D; h: number[] }>();
    const mapFunc: (e: VectorDrawingElement) => [number, SceneElement] = (e) => {
        const hardHidden = parseHardHidden(e.options);
        const layer = parseLayer(e.options);
        const canSelect = parseSeleсtable(e.options);
        const visib = new (hardHidden ? HardHiddenVisibilityComponent : VisibilityComponent)(scene, true, layer);
        const unselectable = canSelect ? null : new UnSelectableComponent();

        switch (e.type) {
            case "group": {
                const groupArgs: GroupElement2DArgs = {
                    handle: e.handle,
                    name: e.name,
                    meta: e.hyperbase,
                };
                const g = new GroupElement2D(scene, groupArgs);
                groups.add({ g, h: e.childHandles });
                return [e.handle, g];
            }
            case "line": {
                const args: LineElement2DArgs = {
                    handle: e.handle,
                    name: e.name,
                    meta: e.hyperbase,
                    visib,
                    unselectable,
                    pen: tools.pens.get(e.penHandle),
                    brush: tools.brushes.get(e.brushHandle),
                    arrowA: e.arrowA && createArrow(e.arrowA, true),
                    arrowB: e.arrowB && createArrow(e.arrowB, false),
                };
                return [e.handle, new graphicsImpl.line(scene, e.coords, args)];
            }
            case "text": {
                const tool = tools.texts.get(e.textToolHandle);
                if (!tool) throw Error(`Инструмент Текст #${e.textToolHandle} не найден`);

                const args: TextElement2DArgs = {
                    handle: e.handle,
                    name: e.name,
                    meta: e.hyperbase,
                    x: e.originX,
                    y: e.originY,
                    width: e.width,
                    height: e.height,
                    angle: ((-e.angle / 10) * Math.PI) / 180,
                    visib,
                    unselectable,
                };
                return [e.handle, new graphicsImpl.text(scene, tool, args)];
            }
            case "control": {
                if (e.inputType !== "EDIT") throw Error(`Элемент ввода ${e.inputType} не реализован.`);
                const args: InputElement2DArgs = {
                    handle: e.handle,
                    name: e.name,
                    meta: e.hyperbase,
                    x: e.originX,
                    y: e.originY,
                    width: e.width,
                    height: e.height,
                    text: e.text,
                    visib,
                    unselectable,
                };
                return [e.handle, new graphicsImpl.input(scene, args)];
            }
            case "bitmap":
            case "doubleBitmap": {
                const isTransparent = e.type === "doubleBitmap";
                const img = (isTransparent ? tools.doubleDibs : tools.dibs).get(e.dibHandle);
                if (!img) throw Error(`Инструмент битовая карта #${e.dibHandle} не найден`);

                const args: ImageElement2DArgs = {
                    handle: e.handle,
                    name: e.name,
                    meta: e.hyperbase,
                    x: e.originX,
                    y: e.originY,
                    width: hardHidden ? 1 : e.width,
                    height: hardHidden ? 1 : e.height,
                    visib,
                    unselectable,
                    crop: {
                        x: e.cropX,
                        y: e.cropY,
                        w: e.cropW,
                        h: e.cropH,
                    },
                };
                return [e.handle, new graphicsImpl.bitmap(scene, isTransparent, img, args)];
            }
            case "view3D":
                throw Error("3D проекции не поддерживаются");
        }
    };

    const objects = new Map(elements?.map(mapFunc));

    groups.forEach(({ g, h }) => {
        const children = h.map<SceneElement>((h) => {
            const o = objects.get(h);
            if (!o) throw Error(`Объект ${h} не найден`);
            return o;
        });
        g.setChildren(children);
    });

    return objects;
}

export function copyElement(w: SceneWrapper, obj: SceneElement, primaryMap: WeakMap<PrimaryElement, PrimaryElement>): SceneElement {
    if (obj.type === "group") {
        const children = obj.children().map((c) => copyElement(w, c as SceneElement, primaryMap));

        const handle = HandleMap.getFreeHandle(w.objects);
        const group = new GroupElement2D(w.scene, {
            handle,
            meta: obj.meta,
            name: obj.name,
            children,
        });
        w.objects.set(handle, group);
        return group;
    }

    let copy: PrimaryElement;
    const handle = HandleMap.getFreeHandle(w.objects);
    switch (obj.type) {
        case "line": {
            const pc = obj.pointCount();
            const coords = new Array(pc * 2);
            for (let i = 0; i < pc; ++i) {
                coords[i * 2] = obj.px(i);
                coords[i * 2 + 1] = obj.py(i);
            }

            const pen = obj.pen.tool();
            const brush = obj.brush.tool();

            copy = new graphicsImpl.line(w.scene, coords, {
                handle,
                meta: obj.meta,
                name: obj.name,
                unselectable: obj.unselectable?.clone(),
                visib: obj.visib.clone(),
                brush: brush ? copyBrush(w, brush) : null,
                pen: pen ? copyPen(w, pen) : null,
                arrowA: obj.arrowA(),
                arrowB: obj.arrowB(),
            });
            break;
        }
        case "image": {
            const toolCopy = copyImageTool(w, obj.isTransparent ? w.doubleDibs : w.dibs, obj.image.tool());

            copy = new graphicsImpl.bitmap(w.scene, obj.isTransparent, toolCopy, {
                handle,
                meta: obj.meta,
                name: obj.name,
                unselectable: obj.unselectable?.clone(),
                visib: obj.visib.clone(),
                x: obj.x(),
                y: obj.y(),
                width: obj.width(),
                height: obj.height(),
                crop: obj.cropArea(),
            });
            break;
        }
        case "text": {
            const toolCopy = copyTextTool(w, obj.tool.tool());

            copy = new graphicsImpl.text(w.scene, toolCopy, {
                handle,
                meta: obj.meta,
                name: obj.name,
                unselectable: obj.unselectable?.clone(),
                visib: obj.visib.clone(),
                x: obj.x(),
                y: obj.y(),
                width: obj.width(),
                height: obj.height(),
                angle: obj.angle(),
            });
            break;
        }
        case "input": {
            const font = obj.font.tool();

            copy = new graphicsImpl.input(w.scene, {
                handle,
                meta: obj.meta,
                name: obj.name,
                unselectable: obj.unselectable?.clone(),
                visib: obj.visib.clone(),
                x: obj.x(),
                y: obj.y(),
                width: obj.width(),
                height: obj.height(),
                text: obj.text(),
                font: font ? copyFontTool(w, font) : null,
            });
            break;
        }
    }

    primaryMap.set(obj, copy);
    w.objects.set(handle, copy);
    return copy;
}

export function createElementOrder(order: number[], objects: Map<number, SceneElement>): PrimaryElement[] {
    return order.map<PrimaryElement>((handle) => {
        const obj = objects.get(handle);
        if (!obj || obj.type === "group") throw Error("Попытка добавить объект неподходящего типа");
        return obj;
    });
}
