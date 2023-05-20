import type { ObjectCollection } from "./ObjectCollection";
import { ElmTreeData } from "elmtree";
import "./CollectionScreen.css";
export declare class CollectionEditor {
    collection: ObjectCollection;
    update: {
        runCascade: () => boolean;
        addToElment: (update: (elm: any, data: unknown) => void) => import("elmtree").ElmObjCascadeData;
        props: unknown;
    };
    bindTo: Record<string, any>;
    constructor(collection: ObjectCollection);
    render(): ElmTreeData;
}
