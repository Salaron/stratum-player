import { UnSelectableComponent } from "../components/unselectableComponent";
import { Scene } from "../scene";
import { GroupElement2D } from "./groupElement2d";

export interface Element2DArgs {
    handle?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    name?: string;
    meta?: Object | null;
    unselectable?: UnSelectableComponent | null;
}

export class Element2D {
    handle: number;
    name: string;
    meta: Object | null;

    _x: number;
    _y: number;
    _width: number;
    _height: number;
    _parent: GroupElement2D | null = null;

    readonly unselectable: UnSelectableComponent | null;

    constructor(readonly scene: Scene, args: Element2DArgs) {
        this.handle = args.handle ?? 0;
        this.name = args.name ?? "";
        this.meta = args.meta ?? null;
        this._x = args.x ?? 0;
        this._y = args.y ?? 0;
        this._width = args.width ?? 0;
        this._height = args.height ?? 0;
        this.unselectable = args.unselectable ?? null;
    }

    _moved(dx: number, dy: number): void {
        this._updateBBox(this._x + dx, this._y + dy, this._width, this._height);
    }

    _rotated(ox: number, oy: number, angle: number): void {
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        // translate point back to origin:
        const posx = this._x - ox;
        const posy = this._y - oy;

        // rotate point
        const xnew = posx * c - posy * s;
        const ynew = posx * s + posy * c;

        // translate point back:
        const x = xnew + ox;
        const y = ynew + oy;
        this._updateBBox(x, y, this._width, this._height);
    }

    _resized(ox: number, oy: number, dx: number, dy: number): void {
        const x = ox + (this._x - ox) * dx;
        const y = oy + (this._y - oy) * dy;
        const width = this._width * dx;
        const height = this._height * dy;
        this._updateBBox(x, y, width, height);
    }

    x(): number {
        return this._x;
    }

    y(): number {
        return this._y;
    }

    width(): number {
        return this._width;
    }

    height(): number {
        return this._height;
    }

    move(x: number, y: number): this {
        this._moved(x - this._x, y - this._y);
        this._parent?._recalcBorders();
        this.scene._dirty = true;
        return this;
    }

    rotate(ox: number, oy: number, angle: number): this {
        if (angle === 0) return this;
        this._rotated(ox, oy, angle);
        this._parent?._recalcBorders();
        this.scene._dirty = true;
        return this;
    }

    size(w: number, h: number): this {
        if (w < 0 || h < 0) return this;

        const cw = this._width || 1;
        const ch = this._height || 1;

        const dx = w / cw;
        const dy = h / ch;
        if (dx === 1 && dy === 1) return this;
        this._resized(this._x, this._y, dx, dy);
        this._parent?._recalcBorders();
        this.scene._dirty = true;
        return this;
    }

    protected _updateBBox(x: number, y: number, width: number, height: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this.scene._dirty = true;
    }

    parent(): GroupElement2D | null {
        return this._parent;
    }
}
