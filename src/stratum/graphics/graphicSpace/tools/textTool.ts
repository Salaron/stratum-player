import { ToolMixin } from "./toolMixin";
import { TextToolState, TextFragment } from "vm-interfaces-gspace";
import { FontTool } from "./fontTool";
import { StringTool } from "./stringTool";
import { StringColor } from "vdr-types";

export interface TextToolTextFragment {
    font: FontTool;
    stringFragment: StringTool;
    foregroundColor: StringColor;
    backgroundColor: StringColor;
}

export class TextTool extends ToolMixin<TextTool> implements TextToolState {
    private cachedString?: { text: string; size: number };
    constructor(private fragments: TextToolTextFragment[]) {
        super();
        this.fragments.forEach(({ font, stringFragment }, idx) => {
            font.subscribe(this, () => this.update());
            stringFragment.subscribe(this, () => this.update());
        });
    }
    updateString(str: StringTool, idx: number) {
        const oldFrag = this.fragments[idx].stringFragment;
        if (oldFrag !== str) {
            this.fragments[idx].stringFragment = str;
            if (oldFrag) oldFrag.unsubscribe(this);
            str.subscribe(this, () => this.dispatchChanges());
        }
        this.update();
    }
    updateFont(font: FontTool, idx: number) {
        const oldFont = this.fragments[idx].font;
        if (oldFont !== font) {
            this.fragments[idx].font = font;
            if (oldFont) oldFont.unsubscribe(this);
            font.subscribe(this, () => this.dispatchChanges());
        }
        this.update();
    }
    updateFgColor(color: StringColor, idx: number) {
        this.fragments[idx].foregroundColor = color;
        this.update();
    }
    updateBgColor(color: StringColor, idx: number) {
        this.fragments[idx].backgroundColor = color;
        this.update();
    }

    private update() {
        this.cachedString = undefined;
        this.dispatchChanges();
    }

    get textCount(): number {
        return this.fragments.length;
    }
    getFragment(index: number): TextFragment {
        return this.fragments[index];
    }
    get assembledText(): { text: string; size: number } {
        if (!this.cachedString) {
            const text = this.fragments.reduce((acc, f) => acc + f.stringFragment.text, "");
            const size = this.fragments.reduce((acc, f) => acc + f.font.size, 0) / this.fragments.length;
            this.cachedString = { text, size };
        }
        return this.cachedString;
    }
    unsubFromTools() {
        this.fragments.forEach(({ font, stringFragment }) => {
            font.unsubscribe(this);
            stringFragment.unsubscribe(this);
        });
    }
}
