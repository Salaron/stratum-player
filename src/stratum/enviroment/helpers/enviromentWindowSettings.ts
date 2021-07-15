import { VdrMerger } from "stratum/common/vdrMerger";
import { VectorDrawing, WindowStyle } from "stratum/fileFormats/vdr";
import { Point2D } from "stratum/helpers/types";
import { ViewContainerOptions, ViewContainerSize } from "stratum/stratum";

export interface EnviromentWindowSettings extends ViewContainerOptions {
    sceneOrg: Point2D | null;
    isChild: boolean;
    vdr?: VectorDrawing | null;
}

export function parseEnviromentWindowSettings(attrib: string, vdr?: VectorDrawing | null): EnviromentWindowSettings {
    const a = attrib.toUpperCase();
    const isChild = a.includes("WS_CHILD");
    const a_useVdrSettings = a.includes("WS_BYSPACE");
    const a_popup = a.includes("WS_POPUP");
    const a_noResize = a.includes("WS_NORESIZE");
    const a_autoOrg = a.includes("WS_AUTOORG");
    const a_bySpaceSize = a.includes("WS_SPACESIZE");
    const a_noCaption = a.includes("WS_NOCAPTION");
    const a_noShadow = a.includes("WS_NOSHADOW");
    const a_vscroll = a.includes("WS_VSCROLL");
    const a_hscroll = a.includes("WS_HSCROLL");

    let size: ViewContainerSize | null = null;
    let hScroll: boolean = false;
    let vScroll: boolean = false;
    let bySpaceSize = false;
    let noResize: boolean = false;
    let isPopup: boolean = false;
    let calcOrg = false;
    let noCaption: boolean = false;
    let noShadow: boolean = false;

    if (a_useVdrSettings && vdr?.settings) {
        const settings = vdr.settings;
        if (settings.x && settings.y) {
            size = { width: settings.x, height: settings.y };
        }

        const style = settings.style;
        if (style & WindowStyle.SWF_HSCROLL) hScroll = true;
        if (style & WindowStyle.SWF_VSCROLL) vScroll = true;
        if (style & WindowStyle.SWF_SPACESIZE) bySpaceSize = true;
        if (style & WindowStyle.SWF_NORESIZE) noResize = true;
        if (style & WindowStyle.SWF_POPUP) isPopup = true;
        if (style & WindowStyle.SWF_AUTOORG) calcOrg = true;
    }

    if (a_hscroll) hScroll = true;
    if (a_vscroll) vScroll = true;
    if (a_bySpaceSize) bySpaceSize = true;
    if (a_noResize) noResize = true;
    if (a_popup) isPopup = true;
    if (a_autoOrg) calcOrg = true;
    if (a_noCaption) noCaption = true;
    if (a_noShadow) noShadow = true;

    let sceneOrg: Point2D | null = null;

    if (vdr?.elements && (calcOrg || bySpaceSize)) {
        const org = VdrMerger.calcRect(vdr.elements);
        if (calcOrg) {
            sceneOrg = { x: org.x, y: org.y };
        }
        if (bySpaceSize) {
            size = { width: org.w, height: org.h };
        }
    }

    return {
        sceneOrg,
        isChild,
        vdr,
        isPopup,
        hScroll,
        noCaption,
        noResize,
        position: null,
        size,
        vScroll,
        title: null,
        noShadow,
    };
}
