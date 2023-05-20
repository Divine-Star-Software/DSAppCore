export type MenuNodeActionData = {
    action: "enter-screen";
    screenManagerId: string;
    screenMode?: string;
    screen: string;
} | {
    action: "custom";
    run: Function;
};
export type MenuNodeData = {
    id: string;
    name: string;
    type: "single";
    action: MenuNodeActionData;
    _sub?: boolean;
} | {
    id: string;
    name: string;
    type: "section";
    childern: MenuNodeData[];
};
