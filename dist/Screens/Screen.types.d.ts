import { ElmTreeData } from "elmtree";
export type ScreenMdeData = {
    id: string;
    getElements: (screenComponent: ElmTreeData) => ElmTreeData | Promise<ElmTreeData>;
    beforeUpdate?: () => Promise<any>;
    afterUpdate?: () => Promise<any>;
    beforeRender?: () => Promise<any>;
    afterRender?: () => Promise<any>;
    onOut?: () => Promise<any>;
    onIn?: () => Promise<any>;
};
export type ScreenData = {
    id: string;
    getElements: () => ElmTreeData | Promise<ElmTreeData>;
    beforeRender?: Function;
    afterRender?: Function;
    onExit?: Function;
};
