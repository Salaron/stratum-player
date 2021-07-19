import { VectorDrawing } from "stratum/fileFormats/vdr";
import { GroupElement2D } from "stratum/graphics/elements/groupElement2d";
import { HandleMap } from "stratum/helpers/handleMap";
import { SceneElement, SceneWrapper } from "../sceneWrapper";
import { createElementOrder, createElements } from "./createNCopyObjects";
import { createBrushTools, createFontTools, createImageTools, createPenTools, createStringTools, createTextTools } from "./createNCopyTools";

export function insertVDR(w: SceneWrapper, vdr: VectorDrawing): SceneElement | null {
    if (!vdr.elements) return null;

    const pens = createPenTools(w.scene, vdr.penTools);
    const dibs = createImageTools(w.scene, vdr.dibTools);
    const brushes = createBrushTools(w.scene, dibs, vdr.brushTools);
    const doubleDibs = createImageTools(w.scene, vdr.doubleDibTools);
    const fonts = createFontTools(w.scene, vdr.fontTools);
    const strings = createStringTools(w.scene, vdr.stringTools);
    const texts = createTextTools(w.scene, fonts, strings, vdr.textTools);

    const objects = createElements(w.scene, { pens, brushes, dibs, doubleDibs, texts }, vdr.elements);

    if (vdr.elementOrder) {
        w.scene.setElements(w.scene.elements().concat(createElementOrder(vdr.elementOrder, objects)));
    }

    // Объединяем инструменты и объекты с имеющимися
    pens.forEach((e) => {
        const handle = HandleMap.getFreeHandle(w.pens);
        e.handle = handle;
        w.pens.set(handle, e);
    });
    dibs.forEach((e) => {
        const handle = HandleMap.getFreeHandle(w.dibs);
        e.handle = handle;
        w.dibs.set(handle, e);
    });
    brushes.forEach((e) => {
        const handle = HandleMap.getFreeHandle(w.brushes);
        e.handle = handle;
        w.brushes.set(handle, e);
    });
    doubleDibs.forEach((e) => {
        const handle = HandleMap.getFreeHandle(w.doubleDibs);
        e.handle = handle;
        w.doubleDibs.set(handle, e);
    });
    strings.forEach((e) => {
        const handle = HandleMap.getFreeHandle(w.strings);
        e.handle = handle;
        w.strings.set(handle, e);
    });
    fonts.forEach((e) => {
        const handle = HandleMap.getFreeHandle(w.fonts);
        e.handle = handle;
        w.fonts.set(handle, e);
    });
    texts.forEach((e) => {
        const handle = HandleMap.getFreeHandle(w.texts);
        e.handle = handle;
        w.texts.set(handle, e);
    });
    objects.forEach((e) => {
        const handle = HandleMap.getFreeHandle(w.objects);
        e.handle = handle;
        w.objects.set(handle, e);
    });

    // Создаем группу либо определяем корневой объект
    const objWithoutGroup = [...objects.values()].filter((o) => !o.parent());
    if (objWithoutGroup.length === 0) throw Error("Ошибка вставки изображения");

    if (objWithoutGroup.length === 1) {
        return objWithoutGroup[0];
    }

    const handle = HandleMap.getFreeHandle(w.objects);
    const group = new GroupElement2D(w.scene, {
        handle,
        children: objWithoutGroup,
    });
    w.objects.set(handle, group);
    return group;
}
