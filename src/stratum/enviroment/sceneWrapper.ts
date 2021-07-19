import { EventSubscriber } from "stratum/common/types";
import { VDRSource } from "stratum/fileFormats/vdr";
import { GroupElement2D } from "stratum/graphics/elements/groupElement2d";
import { PrimaryElement, Scene } from "stratum/graphics/scene";
import { BrushTool } from "stratum/graphics/tools/brushTool";
import { FontTool } from "stratum/graphics/tools/fontTool";
import { ImageTool } from "stratum/graphics/tools/imageTool";
import { PenTool } from "stratum/graphics/tools/penTool";
import { StringTool } from "stratum/graphics/tools/stringTool";
import { TextTool } from "stratum/graphics/tools/textTool";
import { SuperMap } from "stratum/helpers/superMap";
import { Project } from "stratum/project";
import { ViewContainerController } from "stratum/stratum";

export type SceneElement = PrimaryElement | GroupElement2D;

/**
 * Контейнер состояния графического пространства и соответствующего окна.
 */
export interface SceneWrapper {
    handle: number;
    wname: string;
    scene: Scene;
    wnd: ViewContainerController;
    prj: Project;

    objects: Map<number, SceneElement>;
    pens: Map<number, PenTool>;
    brushes: Map<number, BrushTool>;
    dibs: Map<number, ImageTool>;
    doubleDibs: Map<number, ImageTool>;
    fonts: Map<number, FontTool>;
    strings: Map<number, StringTool>;
    texts: Map<number, TextTool>;

    matrix: readonly number[] | null;
    invMatrix: readonly number[] | null;

    scale: number;
    title: string;
    source: VDRSource | null;

    windowMoveSubs: Set<EventSubscriber>;
    spaceDoneSubs: Set<EventSubscriber>;
    sizeSubs: Set<EventSubscriber>;

    controlNotifySubs: SuperMap<EventSubscriber, SceneElement | null>;
    mouseMoveSubs: SuperMap<EventSubscriber, SceneElement | null>;
    leftButtonUpSubs: SuperMap<EventSubscriber, SceneElement | null>;
    leftButtonDownSubs: SuperMap<EventSubscriber, SceneElement | null>;
    rightButtonUpSubs: SuperMap<EventSubscriber, SceneElement | null>;
    rightButtonDownSubs: SuperMap<EventSubscriber, SceneElement | null>;
    middleButtonUpSubs: SuperMap<EventSubscriber, SceneElement | null>;
    middleButtonDownSubs: SuperMap<EventSubscriber, SceneElement | null>;
    keyDownSubs: Set<EventSubscriber>;
    keyUpSubs: Set<EventSubscriber>;
    keyCharSubs: Set<EventSubscriber>;

    children: Set<SceneWrapper>;
    parent: SceneWrapper | null;

    closed: boolean;
}
