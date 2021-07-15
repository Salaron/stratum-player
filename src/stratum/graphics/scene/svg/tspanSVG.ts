import { colorrefToCSSColor } from "stratum/common/colorrefParsers";
import { TextToolPartTool } from "../tools/textToolPartTool";
import { FontSVG } from "./fontSVG";
import { TextSVG } from "./textSVG";

function createTspan() {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspan.setAttribute("dominant-baseline", "text-before-edge"); //фуррифокс
    tspan.setAttribute("alignment-baseline", "text-before-edge");
    // tspan.setAttribute("letter-spacing", "-0.2");
    tspan.style.setProperty("user-select", "none");
    return tspan;
}

export class TSpanSVG {
    _spans: SVGTSpanElement[];
    _prevFontVer = -1;
    _prevText = "";
    _prevFg = -1;
    _prevBg = -1;

    constructor(readonly owner: TextSVG, readonly part: TextToolPartTool) {
        const strs = part.str._tool.textParts();
        this._spans = strs.map(() => createTspan());
    }

    dy = 0;
    render(dy: number): boolean {
        this.dy = dy;
        let shapeChanged = false;
        const part = this.part;
        const text = part.str._tool.text();
        if (this._prevText !== text) {
            this._prevText = text;

            const strs = part.str._tool.textParts();

            let diff = strs.length - this._spans.length;

            if (diff !== 0) {
                this._spans.forEach((s) => {
                    s.removeAttribute("x");
                    s.removeAttribute("dy");
                });
                this._prevFontVer = -1;
                this._prevFg = -1;
                this._prevBg = -1;

                if (diff > 0) {
                    while (diff !== 0) {
                        const s = createTspan();
                        this._spans.push(s);
                        this.owner._svg.append(s);
                        --diff;
                    }
                } else {
                    while (diff !== 0) {
                        this._spans.pop()?.remove();
                        ++diff;
                    }
                }
            }

            this._spans.forEach((s, i) => {
                if (i > 0) {
                    s.setAttribute("x", "0px");
                    const hidden = strs[i].trim().length === 0;
                    if (hidden) {
                        s.innerHTML = "";
                        ++this.dy;
                        return;
                    }
                    s.setAttribute("dy", `${this.dy + 1}em`);
                    this.dy = 0;
                } else if (this.dy > 0) {
                    s.setAttribute("x", "0px");
                    s.setAttribute("dy", `${this.dy}em`);
                    this.dy = 0;
                }
                s.innerHTML = strs[i];
            });

            shapeChanged = true;
        }

        if (this._prevFontVer !== part.font._ver) {
            this._prevFontVer = part.font._ver;
            const f = part.font._tool as FontSVG;

            this._spans.forEach((s) => {
                s.setAttribute("font-family", f.fname());
                s.setAttribute("font-size", f.size().toString());
                s.setAttribute("font-style", f.fstyle());
                s.setAttribute("text-decoration", f.tdecoration());
                s.setAttribute("font-weight", f.fweight());
            });
            shapeChanged = true;
        }

        const fg = this.part.fgColor();
        if (this._prevFg !== fg) {
            this._prevFg = fg;
            this._spans.forEach((s) => s.setAttribute("fill", colorrefToCSSColor(fg)));
        }

        const bg = this.part.bgColor();
        if (this._prevBg !== bg) {
            this._prevBg = bg;
        }
        return shapeChanged;
    }
}
