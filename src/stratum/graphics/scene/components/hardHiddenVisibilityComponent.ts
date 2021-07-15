import { VisibilityComponent } from "./visibilityComponent";

export class HardHiddenVisibilityComponent extends VisibilityComponent {
    override visible(): boolean {
        return false;
    }
    override clone(): HardHiddenVisibilityComponent {
        return new HardHiddenVisibilityComponent(this.scene, this._visible, this._layer);
    }
}
