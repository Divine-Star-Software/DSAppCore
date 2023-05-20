import { ElmTreeData } from "elmtree";
import "./ContextMenu.css";
export declare function ContentMenuElement(): ElmTreeData;
export type ContextMenuButtons = {
    name: string;
    action: Function;
}[];
export declare const ContextMenu: {
    activeId: string;
    state: {
        mode: string;
        visible: boolean;
        elements: ElmTreeData;
    };
    events: import("crystalline-state/StateProxy").StateEventFunctions<{
        mode: string;
        visible: boolean;
        elements: ElmTreeData;
    }>;
    setElements(elements: ElmTreeData): void;
    style: string | false;
    setActive(active: boolean): void;
    dead: boolean;
    isActive(): boolean;
    setButtons(buttons: ContextMenuButtons): void;
};
