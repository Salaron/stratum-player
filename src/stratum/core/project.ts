import { ClassData, VarSetData } from "data-types-base";
import { ProjectController, VmBool } from "vm-interfaces-base";
import { GraphicSpace } from "~/graphics/graphicSpace/graphicSpace";
import { SimpleImageLoader } from "~/graphics/graphicSpace/simpleImageLoader";
import { FabricScene } from "~/graphics/renderers/fabricRenderer/fabricScene";
import { WindowSystem } from "~/graphics/windowSystem";
import { createComposedScheme } from "~/helpers/graphics";
import { VmContext } from "~/vm/vmContext";
import { ClassSchemeNode } from "./classSchemeNode";
import { createClassScheme } from "./createClassScheme";
import { MemoryManager } from "./memoryManager";

export class Project implements ProjectController {
    static create(rootName: string, classes: Map<string, ClassData>, windowSystem: WindowSystem, varSet?: VarSetData) {
        const { root, mmanager } = createClassScheme(rootName, classes);
        if (varSet) root.applyVarSetRecursive(varSet);
        mmanager.initValues();
        return new Project({ scheme: root, classes, mmanager, windowSystem });
    }

    private scheme: ClassSchemeNode;
    private cachedNodes: ClassSchemeNode[];
    private classCollection: Map<string, ClassData>;
    private vm: VmContext;
    private mmanager: MemoryManager;
    private _internallyStopped = true;
    private globalImgLoader = new SimpleImageLoader();

    constructor(data: {
        scheme: ClassSchemeNode;
        classes: Map<string, ClassData>;
        windowSystem: WindowSystem;
        mmanager: MemoryManager;
    }) {
        this.classCollection = data.classes;
        this.scheme = data.scheme;
        this.mmanager = data.mmanager;
        this.vm = new VmContext(data.windowSystem, {} as any, this);
        this.cachedNodes = this.scheme.collectNodes();
    }
    stop() {
        this._internallyStopped = true;
    }

    get error() {
        return this.vm.error;
    }

    oneStep() {
        this._internallyStopped = false;
        if (!this.scheme.computeSchemeRecursive(this.vm)) this._internallyStopped = true;
        const stopped = this._internallyStopped;
        this._internallyStopped = true;
        if (!stopped) {
            this.mmanager.syncValues();
        } else {
            this.reset();
        }
        return !stopped;
    }

    reset() {
        console.warn("Проект остановлен");
    }

    createSchemeInstance(className: string): ((options: HTMLCanvasElement) => GraphicSpace) | undefined {
        const data = this.classCollection.get(className);
        if (!data || !data.scheme) return undefined;
        //TODO: закешировать скомпозированную схему.
        const vdr = data.childs ? createComposedScheme(data.scheme, data.childs, this.classCollection) : data.scheme;
        return canvas => {
            const space = GraphicSpace.fromVdr(
                vdr,
                this.globalImgLoader,
                new FabricScene({ canvas, view: vdr.origin })
            );
            this.globalImgLoader.getPromise().then(() => space.scene.forceRender());
            return space;
        };
    }
    hasClass(className: string): VmBool {
        return this.classCollection.get(className) ? 1 : 0;
    }
    *getClassesByProtoName(className: string): IterableIterator<ClassSchemeNode> {
        //TODO: ПЕРЕПИСАТЬ
        for (const node of this.cachedNodes) if (node.protoName === className) yield node;
    }
}
