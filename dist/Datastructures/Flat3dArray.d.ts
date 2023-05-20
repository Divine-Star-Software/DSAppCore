type Position3Matrix = {
    x: number;
    y: number;
    z: number;
};
/**# Flat 3D Array
 * ---
 * Used to treat a 1d array as a 3d array.
 */
export declare class Flat3DArray {
    bounds: Position3Matrix;
    _position: {
        x: number;
        y: number;
        z: number;
    };
    array: number[] | Uint8Array;
    volumne: number;
    constructor(bounds: Position3Matrix);
    updateBounds(bounds: Position3Matrix): void;
    setArray(array: number[] | Uint8Array): void;
    fillArray(value?: number): void;
    getValue(x: number, y: number, z: number): number;
    getValueUseObj(position: Position3Matrix): number;
    setValue(x: number, y: number, z: number, value: number): void;
    setValueUseObj(position: Position3Matrix, value: number): void;
    deleteValue(x: number, y: number, z: number): void;
    deleteUseObj(position: Position3Matrix): void;
    getIndex(x: number, y: number, z: number): number;
    getXYZ(index: number): Position3Matrix;
}
export {};
