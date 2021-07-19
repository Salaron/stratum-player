import { TextElement2D, TextElement2DArgs } from "../elements/textElement2d";
import { Scene } from "../scene";
import { TextTool } from "../tools/textTool";
import { RendererSVG } from "./rendererSVG";
import { TSpanSVG } from "./tspanSVG";

export class TextSVG extends TextElement2D {
    _svg: SVGTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    private spans: TSpanSVG[];

    private prevVisible = true;
    private prevOx = 0;
    private prevOy = 0;
    private prevWidth = 0;
    private prevHeight = 0;
    private prevAngle = 0;

    private bbox: DOMRect | null = null;

    constructor(scene: Scene, tool: TextTool, args: TextElement2DArgs = {}) {
        super(scene, tool, args);
        const frag = document.createDocumentFragment();
        this.spans = tool.parts.map<TSpanSVG>((part) => {
            const span = new TSpanSVG(this, part);
            span._spans.forEach((s) => frag.append(s));
            return span;
        });
        this._svg.setAttribute("dominant-baseline", "text-before-edge"); //фуррифокс
        this._svg.setAttribute("alignment-baseline", "text-before-edge");
        this._svg.setAttribute("letter-spacing", "-0.07");
        this._svg.style.setProperty("white-space", "pre");
        this._svg.style.setProperty("user-select", "none");

        this._svg.appendChild(frag);
        this._updateBBox(args.x ?? 0, args.y ?? 0, args.width ?? this.actualWidth(), args.height ?? this.actualHeight());
        this._parent?._recalcBorders();
    }

    private getBbox(): DOMRect {
        this.render();
        if (!this.bbox) {
            const p = this._svg.parentElement;
            if (!p) {
                (this.scene as RendererSVG).rootSVG.appendChild(this._svg);
            }
            this.bbox = this._svg.getBBox();
            if (!p) {
                this._svg.remove();
            }
        }
        return this.bbox;
    }

    actualWidth(): number {
        return this.getBbox().width;
    }

    actualHeight(): number {
        // return this.getBbox().height;
        let maxS = 0;
        this.tool._tool.parts.forEach((p) => {
            const s = p.font._tool.size();
            if (s > maxS) maxS = s;
        });
        return maxS * 1.15;
    }

    render(): void {
        const visible = this.visib.visible();
        if (this.prevVisible !== visible) {
            this.prevVisible = visible;
            if (visible) {
                this._svg.removeAttribute("display");
            } else {
                this._svg.setAttribute("display", "none");
            }
        }
        if (!visible) return;

        let shapeChanged = false;
        this.spans.forEach((s) => {
            const res = s.render();
            shapeChanged = shapeChanged || res;
        });
        if (shapeChanged) {
            this.bbox = null;
        }

        // const ox = this._x - this.scene._offsetX;
        // if (ox !== this.prevOx) {
        //     this.prevOx = ox;
        //     this._svg.setAttribute("x", ox.toString());
        // }
        // const oy = this._y - this.scene._offsetY;
        // if (oy !== this.prevOy) {
        //     this.prevOy = oy;
        //     this._svg.setAttribute("y", oy.toString());
        // }
        // const w = this._width;
        // if (this.prevWidth !== w) {
        //     this.prevWidth = w;
        //     this._svg.setAttribute("width", w.toString());
        // }
        // const h = this._height;
        // if (this.prevHeight !== h) {
        //     this.prevHeight = h;
        //     this._svg.setAttribute("height", h.toString());
        // }
        const ox = this._x - this.scene._offsetX;
        const oy = this._y - this.scene._offsetY;
        const a = this._angle;

        if (ox !== this.prevOx || oy !== this.prevOy || this.prevAngle !== a) {
            this.prevOx = ox;
            this.prevOy = oy;
            this.prevAngle = a;
            this._svg.setAttribute("transform", `translate(${ox}, ${oy}), rotate(${(a * 180) / Math.PI})`);
        }
    }
}
