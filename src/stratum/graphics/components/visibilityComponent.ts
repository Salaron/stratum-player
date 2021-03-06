import { Scene } from "../scene";

export class VisibilityComponent {
    constructor(readonly scene: Scene, protected _visible: boolean, protected _layer: number) {}
    visible(): boolean {
        return this._visible && (this._layer & this.scene._layers) === 0;
    }

    setVisible(visible: boolean): this {
        if (this._visible === visible) return this;
        this._visible = visible;
        this.scene._dirty = true;
        return this;
    }

    clone(): VisibilityComponent {
        return new VisibilityComponent(this.scene, this._visible, this._layer);
    }
}
