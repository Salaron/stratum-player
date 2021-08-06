import { LineElement2D, LineElement2DArgs, LineElement2DArrow } from "../elements/lineElement2d";
import { Scene } from "../scene";
import { BrushSVG } from "./brushSVG";
import { coordsToSVGPoints } from "./helpers";
import { PenSVG } from "./penSVG";
import { RendererSVG } from "./rendererSVG";

export interface LineSVGArrowMarker {
    shape: SVGPolylineElement;
    marker: SVGMarkerElement;
}

export class LineSVG extends LineElement2D {
    private static idCounter: number = 0;
    _svg: SVGPolylineElement = document.createElementNS("http://www.w3.org/2000/svg", "polyline");

    private prevVisible = true;
    private prevOx = 0;
    private prevOy = 0;

    private prevPenVer = -1;
    private prevBrushVer = -1;
    private prevShapeVer = -1;

    private prevAArrow: LineElement2DArrow | null = null;
    private svgArrowA: LineSVGArrowMarker | null = null;
    private prevBArrow: LineElement2DArrow | null = null;
    private svgArrowB: LineSVGArrowMarker | null = null;

    constructor(scene: Scene, coords: readonly number[], args: LineElement2DArgs = {}) {
        super(scene, coords, args);
        this._svg.setAttribute("fill-rule", "evenodd");
        this._svg.setAttribute("stroke-linecap", "round");
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

        let toolChanged = false;
        const brushTool = this.brush._tool as BrushSVG | null;
        const penTool = this.pen._tool as PenSVG | null;

        if (this.pen._ver !== this.prevPenVer) {
            this.prevPenVer = this.pen._ver;
            toolChanged = true;
            if (penTool) {
                const pw = penTool.width() || 1;
                this._svg.setAttribute("stroke-width", pw.toString());
                const stroke = penTool.strokeStyle();
                this._svg.setAttribute("stroke", stroke);
            } else {
                this._svg.removeAttribute("stroke");
            }
        }

        if (this.brush._ver !== this.prevBrushVer) {
            this.prevBrushVer = this.brush._ver;
            toolChanged = true;
            if (brushTool) {
                if (this._coords.length > 4) {
                    const fill = brushTool.fillStyle();
                    this._svg.setAttribute("fill", fill);
                    const blend = brushTool.blendMode();
                    if (blend) this._svg.style.setProperty("mix-blend-mode", blend);
                    else this._svg.style.removeProperty("mix-blend-mode");
                } else {
                    this._svg.removeAttribute("fill");
                }
            } else {
                this._svg.setAttribute("fill", "none");
            }
        }

        if (toolChanged) {
            if (!brushTool && !penTool) {
                this._svg.setAttribute("display", "none");
                return;
            } else {
                this._svg.removeAttribute("display");
            }
        }

        if (this._shapeVer !== this.prevShapeVer) {
            this.prevShapeVer = this._shapeVer;
            this._svg.setAttribute("points", coordsToSVGPoints(this._coords));
        }

        if (this.prevAArrow !== this._arrowA || toolChanged) {
            this.prevAArrow = this._arrowA;
            if (this._arrowA && penTool) {
                const a = this.svgArrowA || (this.svgArrowA = this.createMarker("marker-end"));
                this.setArrowAttribs(a, this._arrowA, penTool);
                a.marker.setAttribute("refX", this._arrowA.width.toString());
            } else {
                this.svgArrowA?.marker.remove();
                this.svgArrowA = null;
            }
        }

        if (this.prevBArrow !== this._arrowB || toolChanged) {
            this.prevBArrow = this._arrowB;
            if (this._arrowB && penTool) {
                const a = this.svgArrowB || (this.svgArrowB = this.createMarker("marker-start"));
                this.setArrowAttribs(a, this._arrowB, penTool);
            } else {
                this.svgArrowB?.marker.remove();
                this.svgArrowB = null;
            }
        }

        const ox = this._x - this.scene._offsetX;
        const oy = this._y - this.scene._offsetY;

        if (ox !== this.prevOx || oy !== this.prevOy) {
            this.prevOx = ox;
            this.prevOy = oy;
            this._svg.setAttribute("transform", `translate(${ox}, ${oy})`);
        }
    }

    private setArrowAttribs(a: LineSVGArrowMarker, arrow: LineElement2DArrow, penTool: PenSVG) {
        const pw = penTool.width() || 1;
        a.marker.setAttribute("markerWidth", (arrow.width + pw).toString());
        a.marker.setAttribute("markerHeight", (arrow.oy * 2 + pw).toString());
        a.marker.setAttribute("refY", arrow.oy.toString());
        a.marker.setAttribute("markerUnits", "userSpaceOnUse");
        a.shape.setAttribute("points", coordsToSVGPoints(arrow.coords));

        const style = penTool.strokeStyle();
        a.shape.setAttribute("stroke-width", pw.toString());
        a.shape.setAttribute("fill", arrow.fill ? style : "none");
        a.shape.setAttribute("stroke", penTool.strokeStyle());
    }

    private createMarker(type: string): LineSVGArrowMarker {
        const id = `arrow_${++LineSVG.idCounter}`;
        const shape = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        // shape.setAttribute("stroke-linecap", "round");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", id);
        marker.setAttribute("orient", "auto");
        marker.appendChild(shape);
        marker.setAttribute("refX", "0");
        (this.scene as RendererSVG)._defs.appendChild(marker);
        this._svg.setAttribute(type, `url(#${id})`);
        return { shape, marker };
    }
}
