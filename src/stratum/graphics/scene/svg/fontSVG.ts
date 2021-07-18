import { FontTool } from "../tools/fontTool";

export class FontSVG extends FontTool {
    // this._style = (italic ? 1 : 0) | (underline ? 2 : 0) | (strikeOut ? 4 : 0) | (weight ? 8 : 0);
    // this._cssName = fontName.toUpperCase().endsWith(" CYR") ? fontName.slice(0, fontName.length - 4) : fontName;
    // this._size *= this._size < 0 ? -1 : 1;
    // this._cssName = fontName.endsWith(" CYR") ? fontName.slice(0, fontName.length - 4) : fontName;

    private _prevName = "";
    private _realName: string = "";

    private _scaleThis = false;

    fstyle(): string {
        return this._style & 1 ? "italic" : "normal";
    }

    tdecoration(): string {
        const underline = this._style & 2 ? "underline" : "";
        const strike = this._style & 4 ? "line-through" : "";
        return underline + " " + strike;
    }

    fweight(): string {
        return this._style & 8 ? "bold" : "normal";
    }

    private scaleThis(): boolean {
        const nm = this._name;
        if (this._prevName !== nm) {
            this._prevName = nm;
            const scale = nm.toUpperCase().endsWith(" CYR");
            this._realName = scale ? nm.slice(0, nm.length - 4) : nm;
            this._scaleThis = scale;
        }
        return this._scaleThis;
    }

    // spacing(): number {
    //     return this.scaleThis() ? 0.5 : -0.5;
    // }

    // scale(): number {
    //     return this.scaleThis() ? this.size() + 1 : this.size() - 1;
    // }

    fname(): string {
        this.scaleThis();
        return this._realName;
    }

    private static readonly fuckthisshit = 0.752812499999996 ** 2;
    toCSSString() {
        return `${this._style & 8 ? "bold" : ""} ${this._style & 1 ? "italic" : ""} ${this._size * FontSVG.fuckthisshit}px ${this.fname()}`;
    }
}
