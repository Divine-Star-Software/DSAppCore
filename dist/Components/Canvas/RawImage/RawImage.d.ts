import { ElmTreeData } from "elmtree";
export declare function RawImage(width: number, height: number, getData: () => Promise<{
    mode: "single" | "overlay" | "animated";
    textures: Uint8ClampedArray[];
    flipY?: boolean;
}>): readonly [ElmTreeData, () => Promise<void>];
