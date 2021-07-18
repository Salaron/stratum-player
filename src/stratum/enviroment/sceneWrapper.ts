import { EventSubscriber } from "stratum/common/types";
import { VDRSource } from "stratum/fileFormats/vdr";
import { GroupElement2D } from "stratum/graphics/scene/elements/groupElement2d";
import { PrimaryElement, Scene } from "stratum/graphics/scene/scene";
import { BrushTool } from "stratum/graphics/scene/tools/brushTool";
import { FontTool } from "stratum/graphics/scene/tools/fontTool";
import { ImageTool } from "stratum/graphics/scene/tools/imageTool";
import { PenTool } from "stratum/graphics/scene/tools/penTool";
import { StringTool } from "stratum/graphics/scene/tools/stringTool";
import { TextTool } from "stratum/graphics/scene/tools/textTool";
import { SuperMap } from "stratum/helpers/superMap";
import { Project } from "stratum/project";
import { ViewContainerController } from "stratum/stratum";

export type SceneElement = PrimaryElement | GroupElement2D;

export interface SceneWrapper {
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
    scene: Scene;
    scale: number;
    wnd: ViewContainerController;
    wname: string;
    handle: number;
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
