import "./UVPicker.css";
import { Vec2Array } from "divine-voxel-engine/Math";
export declare class UVPicker {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    textureSize: {
        width: number;
        height: number;
    };
    _pixelSize: number;
    selection: {
        ex: number;
        ey: number;
        sx: number;
        sy: number;
    };
    uv: {
        ws: number;
        we: number;
        hs: number;
        he: number;
    };
    _onUpdate: Map<string, Function>;
    _currentImage: Uint8ClampedArray;
    _convert(value: number): number;
    constructor();
    setPixelSize(size: number): void;
    registerOnUpdate(id: string, run: (uvPicker: UVPicker) => void): void;
    removeFromOnUpdate(id: string): void;
    setCurrentImage(image: Uint8ClampedArray): Promise<void>;
    _drawImage(texture: Uint8ClampedArray): Promise<void>;
    drawAll(): Promise<void>;
    update(data: {
        width: number;
        height: number;
        selectionStart: Vec2Array;
        selectionEnd: Vec2Array;
    }): void;
    store(): {
        start: Vec2Array;
        end: Vec2Array;
    };
    render(): import("elmtree").ElmTreeData;
}
