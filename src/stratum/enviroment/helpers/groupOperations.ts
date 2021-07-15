import { SceneElement } from "../sceneWrapper";

export function switchGroupElementsVisible(elements: readonly SceneElement[], visible: boolean): void {
    elements.forEach((e) => {
        if (e.type === "group") {
            switchGroupElementsVisible(e.children() as readonly SceneElement[], visible);
        } else {
            e.visib.setVisible(visible);
        }
    });
}

export function deleteGroupElements(elements: readonly SceneElement[], set: WeakSet<SceneElement>): void {
    elements.forEach((e) => {
        set.add(e);
        if (e.type === "group") {
            deleteGroupElements(e.children() as readonly SceneElement[], set);
        }
    });
}

export function searchInGroup(name: string, elements: readonly SceneElement[]): SceneElement | null {
    for (const c of elements) {
        if (c.name === name) return c;
        if (c.type === "group") {
            const res = searchInGroup(name, c.children() as readonly SceneElement[]);
            if (res) return res;
        }
    }
    return null;
}
