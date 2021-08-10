import { colorrefToCSSColor } from "stratum/common/colorrefParsers";
import { encode } from "stratum/helpers/win1251";
import { TextToolPartTool } from "../tools/textToolPartTool";
import { FontSVG } from "./fontSVG";
import { TextSVG } from "./textSVG";

// export function createFilter(color: string, id: string) {
//     const node1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
//     node1.setAttribute("in", "bg");
//     const node2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
//     node2.setAttribute("in", "SourceGraphic");

//     const femerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
//     femerge.append(node1, node2);

//     const flood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood");
//     flood.setAttribute("flood-color", color);
//     flood.setAttribute("result", "bg");

//     const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
//     filter.setAttribute("x", "0");
//     filter.setAttribute("y", "0");
//     filter.setAttribute("width", "1");
//     filter.setAttribute("height", "1");
//     filter.setAttribute("id", id);

//     filter.append(flood, femerge);
//     return filter;
// }

function createTspan() {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    // tspan.setAttribute("dominant-baseline", "text-before-edge"); //фуррифокс
    // tspan.setAttribute("alignment-baseline", "text-before-edge");
    // tspan.style.setProperty("white-space", "pre");
    // tspan.style.setProperty("user-select", "none");
    // tspan.style.setProperty("white-space", "pre");
    // tspan.style.setProperty("user-select", "none");

    // tspan.setAttribute("letter-spacing", "-0.07");
    return tspan;
}

export class TSpanSVG {
    _subspans: SVGTSpanElement[];
    _prevFontVer = -1;
    _prevText = "";
    _prevFg = -1;
    _prevBg = -1;

    constructor(readonly owner: TextSVG, readonly part: TextToolPartTool) {
        const strs = part.str._tool.textParts();
        this._subspans = strs.map(() => createTspan());
    }

    render(): boolean {
        let shapeChanged = false;
        const part = this.part;

        const text = part.str._tool.text();
        const font = part.font._tool as FontSVG;

        if (this._prevText !== text) {
            this._prevText = text;

            const strs = part.str._tool.textParts();

            let diff = strs.length - this._subspans.length;

            if (diff !== 0) {
                this._subspans.forEach((s) => {
                    s.removeAttribute("x");
                    s.removeAttribute("dy");
                });
                this._prevFontVer = -1;
                this._prevFg = -1;
                this._prevBg = -1;

                if (diff > 0) {
                    const subspansLen = this._subspans.length - 1;
                    let wherePut = subspansLen > 0 ? this._subspans[subspansLen - 1] : this.owner._svg;
                    while (diff !== 0) {
                        const s = createTspan();
                        this._subspans.push(s);
                        wherePut.after(s);
                        wherePut = s;
                        --diff;
                    }
                } else {
                    while (diff !== 0) {
                        this._subspans.pop()?.remove();
                        ++diff;
                    }
                }
            }

            this._subspans.forEach((s, i) => {
                if (i > 0) {
                    s.setAttribute("x", "0px");
                    s.setAttribute("dy", `1.15em`);
                    // s.setAttribute("dy", f.size() + "px");
                }
                let text = strs[i];
                if (font.fname() === "Symbol") {
                    text = [...encode(text)].map((el) => String.fromCharCode(el === 142 ? 163 : el)).join("");
                }
                s.innerHTML = text || "&#8203;";
            });

            shapeChanged = true;
        }

        if (this._prevFontVer !== part.font._ver) {
            this._prevFontVer = part.font._ver;

            this._subspans.forEach((s) => {
                s.setAttribute("font-family", font.fname());
                // s.setAttribute("letter-spacing", f.spacing().toString());
                s.setAttribute("font-size", font.size().toString());
                s.setAttribute("font-style", font.fstyle());
                s.setAttribute("text-decoration", font.tdecoration());
                s.setAttribute("font-weight", font.fweight());
            });
            shapeChanged = true;
        }

        const fg = this.part.fgColor();
        if (this._prevFg !== fg) {
            this._prevFg = fg;
            const col = colorrefToCSSColor(fg);
            this._subspans.forEach((s) => s.setAttribute("fill", col));
        }

        const bg = this.part.bgColor();
        if (this._prevBg !== bg) {
            this._prevBg = bg;
            const col = colorrefToCSSColor(bg);
            if (col === "transparent") {
                this._subspans.forEach((s) => s.removeAttribute("filter"));
            } else {
                // const defs = (this.owner.scene as RendererSVG)._defs;
                // const id = `bg_${bg}`;
                // this._spans.forEach((s) => s.setAttribute("filter", `drop-shadow(0px 0px 6px ${col})`));
                // let filter = defs.querySelector(`#${id}`);
                // if (!filter) {
                //     filter = createFilter(col, id);
                //     defs.appendChild(filter);
                // }
                this._subspans.forEach((s) => s.setAttribute("filter", `drop-shadow(0px 0px 6px ${col})`));
                // this._spans.forEach((s) => s.setAttribute("filter", `url(#${id})`));
            }
        }
        return shapeChanged;
    }

    delete(): void {
        this._subspans.forEach((s) => s.remove());
    }
}
