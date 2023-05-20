import "./LayerPainter.css";
import { Vec3Array } from "divine-voxel-engine/Math";
import { VisitedMap } from "divine-voxel-engine/Global/Util/VisistedMap.js";
import { ElmTreeData } from "elmtree";
type LayerNodeData = {
    position: Vec3Array;
    nodeId: string;
};
export type LayerNodePaletteData = Record<string, {
    char: string;
    color: string;
    size: Vec3Array;
    name: string;
}>;
export declare class LayerPainter {
    nodeData: {
        palette: LayerNodePaletteData;
        editable?: boolean;
    };
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    layerSize: {
        width: number;
        height: number;
    };
    nodes: Map<string, false | LayerNodeData>;
    constructor(nodeData: {
        palette: LayerNodePaletteData;
        editable?: boolean;
    });
    fillSectorAt(px: number, py: number): void;
    _visistedMap: VisitedMap;
    drawNode(x: number, y: number, addToMap?: boolean): void;
    drawAll(): void;
    clearSectorAt(px: number, py: number): void;
    setSize(data: {
        width: number;
        height: number;
    }): void;
    getData(): (string | number)[][];
    import(nodes: LayerNodeData[]): this;
    store(): LayerNodeData[];
    updatePalette: {
        runCascade: () => boolean;
        addToElment: (update: (elm: any, data: unknown) => void) => import("elmtree").ElmObjCascadeData;
        props: unknown;
    };
    activeNode: string;
    render(): ElmTreeData | {
        type: string;
        element: HTMLCanvasElement;
    };
}
export {};
