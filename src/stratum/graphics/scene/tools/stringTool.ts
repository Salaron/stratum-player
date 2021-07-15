import { Scene } from "../scene";
import { SceneTool } from "./sceneTool";

export interface StringToolArgs {
    handle?: number;
}

export class StringTool extends SceneTool<StringTool> {
    protected _text: string;
    protected _textVer = 0;
    private prevTextVer = -1;
    private _textParts: string[] = [];

    constructor(scene: Scene, text: string, { handle }: StringToolArgs = {}) {
        super(scene, handle);
        this._text = text;
    }

    text(): string {
        return this._text;
    }

    setText(text: string): this {
        this._text = text;
        ++this._textVer;
        this.dispatchChanges();
        return this;
    }

    textParts(): string[] {
        if (this.prevTextVer !== this._textVer) {
            this.prevTextVer = this._textVer;
            this._textParts = this._text.split("\r\n").join("\n").split("\n");
        }
        return this._textParts;
    }
}
