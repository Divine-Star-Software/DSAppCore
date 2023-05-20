import { ElmTreeData, ComponentUpdate } from "elmtree";
import { ScreenData, ScreenMdeData } from "./Screen.types.js";
export declare class ScreenManager {
    id: string;
    static MAX_HISTORY_LENGTH: number;
    static screenManagers: Map<string, ScreenManager>;
    static destoryAll(): void;
    static getScreenManager(id: string): ScreenManager | undefined;
    _screenState: {
        screen: string;
        mode: string;
    };
    _history: [screen: string, screenMode: string][];
    _updateComponent: ComponentUpdate<ElmTreeData>;
    _screenComponent: ElmTreeData;
    _cascade: {
        runCascade: () => boolean;
        addToElment: (update: (elm: any, data: {
            enabled: boolean;
        }) => void) => import("elmtree").ElmObjCascadeData;
        props: {
            enabled: boolean;
        };
    };
    _enabled: boolean;
    setEnabled(enabled: boolean): void;
    constructor(id: string);
    destroy(): void;
    update(screen: string, screenMode?: string): Promise<void>;
    goBack(): Promise<void>;
    render(): ElmTreeData;
    screenModes: {
        _current: string;
        _map: Map<string, {
            data: ScreenMdeData;
            component: [ElmTreeData, ComponentUpdate<unknown>, {
                elements: ElmTreeData;
            }];
        }>;
        add(screenModes: ScreenMdeData[]): void;
        get(screenId: string): false | {
            data: ScreenMdeData;
            component: [ElmTreeData, ComponentUpdate<unknown>, {
                elements: ElmTreeData;
            }];
        };
        render: (id: string) => Promise<false | undefined>;
    };
    screens: {
        _currentData: ScreenData | null;
        _map: Map<string, ScreenData>;
        add(screens: ScreenData[]): void;
        get(screenId: string): false | ScreenData;
        render: (id: string) => Promise<false | undefined>;
    };
}
