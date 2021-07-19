import { SmoothExecutor } from "stratum/helpers/computers";
import { eventCodeToWinDigit } from "stratum/helpers/keyboardEventKeyMap";
import { win1251Table } from "stratum/helpers/win1251";
import { InputElement2D } from "../elements/inputElement2d";
import {
    Scene,
    SceneArgs,
    SceneInputEvent,
    SceneInputEventCallback,
    SceneInputEventType,
    SceneKeyboardEvent,
    SceneKeyboardEventCallback,
    SceneKeyboardEventType,
    ScenePointerEvent,
    ScenePointerEventCallback,
    ScenePointerEventType,
} from "../scene";
import { ImageSVG } from "./imageSVG";
import { InputSVG } from "./inputSVG";
import { LineSVG } from "./lineSVG";
import { TextSVG } from "./textSVG";

type SVGChild = LineSVG | ImageSVG | TextSVG;
type HTMLChild = InputSVG;
type SVGOrHTMLChild = SVGChild | HTMLChild;

interface RendererSVGHandlers {
    pointermove: Set<ScenePointerEventCallback>;
    pointerdown: Set<ScenePointerEventCallback>;
    pointerup: Set<ScenePointerEventCallback>;
    keydown: Set<SceneKeyboardEventCallback>;
    keyup: Set<SceneKeyboardEventCallback>;
    keychar: Set<SceneKeyboardEventCallback>;
    inputState: Set<SceneInputEventCallback>;
}

export class RendererSVG extends Scene implements EventListenerObject {
    private static scenes = new Set<RendererSVG>();
    private static updater = new SmoothExecutor();

    private static redrawAll(): boolean {
        RendererSVG.scenes.forEach((w) => w.render());
        return RendererSVG.scenes.size > 0;
    }

    private static focusedScene: RendererSVG | null = null;
    private static captureTarget: RendererSVG | null = null; //FIXME: при установке капчура у других он сбрасываться не должен.
    private static currentScene: RendererSVG | null = null;

    private static _mouseX: number = 0;
    private static _mouseY: number = 0;

    static handleKeyboard(evt: KeyboardEvent) {
        const code = eventCodeToWinDigit.get(evt.code);
        if (typeof code !== "undefined") {
            Scene.keyState[code] = evt.type === "keydown" ? 1 : 0;
        }

        const realCode = code ?? 0;
        if (RendererSVG.captureTarget !== RendererSVG.focusedScene) RendererSVG.captureTarget?.handleKeyboard(evt, realCode);
        RendererSVG.focusedScene?.handleKeyboard(evt, realCode);
    }

    static handlePointer(evt: PointerEvent) {
        Scene.keyState[1] = evt.buttons & 1;
        Scene.keyState[2] = evt.buttons & 2;
        Scene.keyState[4] = evt.buttons & 4;
        RendererSVG._mouseX = evt.clientX;
        RendererSVG._mouseY = evt.clientY;

        const t = evt.target as SVGSVGElement;
        if (RendererSVG.currentScene?.rootSVG !== t) {
            RendererSVG.currentScene = null;
            for (const v of RendererSVG.scenes) {
                if (v.rootSVG.contains(t)) {
                    RendererSVG.currentScene = v;
                    break;
                }
            }
        }

        if (evt.type === "pointerdown") {
            RendererSVG.focusedScene = RendererSVG.currentScene;
        }
        // На тачпадах событие pointerdown также генерирует pointermove.
        // Таким образом обходим эту проблему.
        // this.blockFirstPointerMove = true;
        // } else if (type === "pointermove" && this.blockFirstPointerMove) {
        //     this.blockFirstPointerMove = false;
        //     return;
        // }

        if (RendererSVG.captureTarget !== RendererSVG.currentScene) RendererSVG.captureTarget?.handlePointer(evt);
        RendererSVG.currentScene?.handlePointer(evt);

        // if (evt.type === "pointerdown" && RendererSVG.kbdEvtReceiver) {
        //     console.log("here");
        //     RendererSVG.kbdEvtReceiver = null;
        // }
    }

    private prevElements = this._elements as readonly SVGOrHTMLChild[];
    private svgOrder: SVGChild[] = [];
    private htmlOrder: HTMLChild[] = [];

    private _rect: DOMRect | null = null;
    private prevScale: number = 1;

    private handlers: RendererSVGHandlers = {
        pointerdown: new Set(),
        pointermove: new Set(),
        pointerup: new Set(),
        keydown: new Set(),
        keyup: new Set(),
        keychar: new Set(),
        inputState: new Set(),
    };
    // private blockFirstPointerMove = false;
    // _defs: SVGDefsElement;

    readonly view: HTMLDivElement;
    readonly rootSVG: SVGSVGElement;
    readonly rootHTML: HTMLDivElement;

    constructor(args?: SceneArgs) {
        super(args);

        const view = (this.view = document.createElement("div"));
        view.style.setProperty("overflow", "hidden"); //скрываем любые дочерние инпуты, которые вылазят за границу.
        view.style.setProperty("position", "relative"); //нужно, т.к. дочерние input-ы позиционируются абсолютно.
        view.style.setProperty("width", "100%");
        view.style.setProperty("height", "100%");
        view.style.setProperty("background-color", "white");

        this.rootSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.rootSVG.addEventListener("selectstart", this);
        this.rootSVG.style.setProperty("width", "100%");
        this.rootSVG.style.setProperty("height", "100%");
        this.rootSVG.style.setProperty("transform-origin", "top left");
        this.rootSVG.style.setProperty("touch-action", "pinch-zoom"); //было: "pan-x pan-y". pinch-zoom работает лучше.

        this.rootHTML = document.createElement("div");
        this.rootHTML.style.setProperty("width", "100%");
        this.rootHTML.style.setProperty("height", "100%");
        this.rootHTML.style.setProperty("transform-origin", "top left");

        view.appendChild(this.rootSVG);
        view.appendChild(this.rootHTML);

        // this.root.appendChild((this._defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")));
        RendererSVG.scenes.add(this);
        RendererSVG.updater.run(RendererSVG.redrawAll);
    }

    private rect(): DOMRect {
        if (!this._rect) {
            this._rect = this.view.getBoundingClientRect();
        }
        return this._rect;
    }

    private render(): this {
        const elements = this._elements as readonly SVGOrHTMLChild[];

        const scale = this._scale;
        if (this.prevScale !== scale) {
            this.prevScale = scale;
            this.rootSVG.style.setProperty("transform", `scale(${scale})`);
            this.rootSVG.style.setProperty("width", `${100 / scale}%`);
            this.rootSVG.style.setProperty("height", `${100 / scale}%`);

            this.rootHTML.style.setProperty("transform", `scale(${scale})`);
            this.rootHTML.style.setProperty("width", `${100 / scale}%`);
            this.rootHTML.style.setProperty("height", `${100 / scale}%`);
        }

        const prevElements = this.prevElements;

        if (prevElements !== elements) {
            const svgs: SVGChild[] = [];
            const htmls: InputSVG[] = [];

            elements.forEach((e) => {
                if (e._svg) {
                    svgs.push(e);
                } else {
                    htmls.push(e);
                }
            });

            if (this.svgOrder.length > 0) {
                RendererSVG.reoderNRender(this.rootSVG, svgs, this.svgOrder);
            } else {
                this.rootSVG.append(...svgs.map((s) => s._svg));
            }
            this.svgOrder = svgs;

            if (this.htmlOrder.length > 0) {
                RendererSVG.reoderNRender(this.rootHTML, htmls, this.htmlOrder);
            } else {
                this.rootHTML.append(...htmls.map((s) => s._html));
            }
            this.htmlOrder = htmls;

            this.prevElements = elements;
        } else {
            elements.forEach((e) => e.render());
        }
        this._rect = null;
        return this;
    }

    private static reoderNRender(root: Element, newOrder: readonly SVGOrHTMLChild[], prevOrder: readonly SVGOrHTMLChild[]): void {
        let idx = 0;
        let previousElem: Element | null = null;
        const del = new Set(prevOrder);
        newOrder.forEach((e) => {
            del.delete(e);
            if (idx < prevOrder.length && e === prevOrder[idx]) {
                ++idx;
            } else {
                const where = previousElem ? previousElem.nextElementSibling : root.firstElementChild;
                root.insertBefore(e._svg || e._html, where);
            }
            previousElem = e._svg || e._html;
            e.render();
        });
        del.forEach((e) => (e._svg || e._html).remove());
    }

    elementAtPoint(x: number, y: number): SVGChild | null {
        const rect = this.rect();
        const clientX = rect.left + (x - this._offsetX) * this.prevScale;
        const clientY = rect.top + (y - this._offsetY) * this.prevScale;
        const el = document.elementsFromPoint(clientX, clientY);
        if (el.length === 0) return null;

        for (const e of el) {
            const f = this.svgOrder.find((s) => s._svg.contains(e));
            if (f) return f;
        }
        return null;
        // return (el.length > && this.svgOrder.find((e) => e._svg.contains(el))) || null;
    }

    setCapture(): this {
        RendererSVG.captureTarget = this;
        return this;
    }
    releaseCapture(): this {
        RendererSVG.captureTarget = null;
        return this;
    }

    on(event: ScenePointerEventType, callback: ScenePointerEventCallback): this;
    on(event: SceneKeyboardEventType, callback: SceneKeyboardEventCallback): this;
    on(event: "inputState", callback: SceneInputEventCallback): this;
    on(event: keyof RendererSVG["handlers"], callback: any): this {
        this.handlers[event].add(callback);
        return this;
    }

    off(event: ScenePointerEventType, callback?: ScenePointerEventCallback): this;
    off(event: SceneKeyboardEventType, callback?: SceneKeyboardEventCallback): this;
    off(event: "inputState", callback?: SceneInputEventCallback): this;
    off(event: keyof RendererSVG["handlers"], callback: any): this {
        if (callback) {
            this.handlers[event].delete(callback);
        } else {
            this.handlers[event].clear();
        }
        return this;
    }

    mouseCoords(): [number, number] {
        const rect = this.rect();
        const x = (RendererSVG._mouseX - rect.left) / this.prevScale + this._offsetX;
        const y = (RendererSVG._mouseY - rect.top) / this.prevScale + this._offsetY;
        return [x, y];
    }

    private handlePointer(evt: PointerEvent): void {
        const type = evt.type as ScenePointerEventType;

        const rect = this.rect();
        const clickX = (evt.clientX - rect.left) / this.prevScale;
        const clickY = (evt.clientY - rect.top) / this.prevScale;
        const x = clickX + this._offsetX;
        const y = clickY + this._offsetY;
        const { button, buttons } = evt;

        const element = (evt.target !== evt.currentTarget && this.svgOrder.find((e) => e._svg.contains(evt.target as Node))) || null;
        const event: ScenePointerEvent = { target: this, type, clickX, clickY, x, y, buttons, button, element };

        this.handlers[type].forEach((h) => h(event));
        return;
    }

    private handleKeyboard(evt: KeyboardEvent, rawKey: number): void {
        const repeat = 1;
        const scan = 0;

        const type = evt.type as "keydown" | "keyup";
        const event: SceneKeyboardEvent = {
            type,
            target: this,
            repeat,
            scan,
            key: rawKey,
        };
        this.handlers[type].forEach((h) => h(event));

        if (type === "keydown") {
            //стрелки, Delete, Insert не отправляют WM_CHAR, т.к. не проходят TranslateMessage... Хер пойми как она работает.
            if ((rawKey > 36 && rawKey < 41) || rawKey === 46 || rawKey === 45) return;

            const idx = win1251Table.indexOf(evt.key);
            const translatedKey = idx < 0 ? rawKey : idx;

            const event: SceneKeyboardEvent = {
                type: "keychar",
                target: this,
                repeat,
                scan,
                key: translatedKey,
            };
            this.handlers[type].forEach((h) => h(event));
        }
    }

    beforeRemove(): void {
        if (RendererSVG.currentScene === this) RendererSVG.currentScene = null;
        if (RendererSVG.focusedScene === this) RendererSVG.focusedScene = null;
        if (RendererSVG.captureTarget === this) RendererSVG.captureTarget = null;
    }

    // selectstart
    handleEvent(evt: Event): void {
        evt.preventDefault();
    }

    _dispatchInputEvent(element: InputElement2D, evt: Event) {
        switch (evt.type) {
            case "input":
            case "blur":
                break;
            case "focus":
                RendererSVG.focusedScene = null;
                break;
            default:
                return;
        }
        const type: SceneInputEventType = evt.type;

        const event: SceneInputEvent = {
            type,
            target: this,
            element,
        };
        this.handlers.inputState.forEach((h) => h(event));
    }

    toDataURL(x: number, y: number, w: number, h: number): [string, string] {
        //get svg source.
        let source = new XMLSerializer().serializeToString(this.rootSVG);

        //add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        //convert svg source to URI data scheme.
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

        return ["svg", url];
    }
}

window.addEventListener("pointerdown", RendererSVG.handlePointer);
window.addEventListener("pointermove", RendererSVG.handlePointer);
window.addEventListener("pointerup", RendererSVG.handlePointer);
window.addEventListener("keydown", RendererSVG.handleKeyboard);
window.addEventListener("keyup", RendererSVG.handleKeyboard);
