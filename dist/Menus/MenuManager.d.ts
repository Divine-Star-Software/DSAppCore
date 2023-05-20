import { ElmTreeData, ComponentUpdate, ElmTreeObjAddons } from "elmtree";
import { MenuNodeActionData, MenuNodeData } from "./Menu.types";
import "./Menu.css";
import { ObjectIndex } from "../Indexing/ObjectIndex.js";
export declare class MenuManager {
    data: {
        id: string;
        formatMenu(compoent: ElmTreeData): ElmTreeData;
        formatSingle(node: MenuNodeData, addons: ElmTreeObjAddons[]): ElmTreeData;
        formatSection(node: MenuNodeData, addons: ElmTreeObjAddons[]): ElmTreeData;
    };
    static menuManagers: Map<string, MenuManager>;
    static destoryAll(): void;
    static _processNodeAction(action: MenuNodeActionData): void;
    _nodeIndex: ObjectIndex<MenuNodeData>;
    _updateComponent: ComponentUpdate<ElmTreeData>;
    _menuComponent: ElmTreeData;
    _cascade: {
        runCascade: () => boolean;
        addToElment: (update: (elm: any, data: {
            active: boolean;
        }) => void) => import("elmtree").ElmObjCascadeData;
        props: {
            active: boolean;
        };
    };
    _menuSections: Map<string, MenuNodeData[]>;
    _state: {
        node: string;
        section: string;
    };
    _connectMenuState(node: MenuNodeData): import("elmtree").ElmObjCascadeData;
    _updateState(node: MenuNodeData, runAction?: boolean): void;
    menuElements: {
        single: (node: MenuNodeData, sub?: boolean) => ElmTreeData;
        section: (node: MenuNodeData) => ElmTreeData[];
    };
    constructor(data: {
        id: string;
        formatMenu(compoent: ElmTreeData): ElmTreeData;
        formatSingle(node: MenuNodeData, addons: ElmTreeObjAddons[]): ElmTreeData;
        formatSection(node: MenuNodeData, addons: ElmTreeObjAddons[]): ElmTreeData;
    });
    destroy(): void;
    render(): ElmTreeData;
    setActiveNode(sectionId: string, id: string): void;
    runNodeAction(sectionId: string, id: string): void;
    addToMenuSection(id: string, nodes: MenuNodeData[]): void;
    _renderNode(node: MenuNodeData): ElmTreeData;
    renderSection(id: string): void;
}
