type  Position3Matrix   = {x:number,y:number,z:number};

/**# Flat 3D Array
 * ---
 * Used to treat a 1d array as a 3d array.
 */
export class Flat3DArray {
  _position = {
    x: 0,
    y: 0,
    z: 0,
  };
  array: number[] | Uint8Array  = [];
  volumne = 0;

  constructor(public bounds: Position3Matrix) {
    this.volumne = bounds.x * bounds.y * bounds.z;
    this.fillArray();
  }

  updateBounds(bounds: Position3Matrix) {
    this.bounds.x = bounds.x;
    this.bounds.y = bounds.y;
    this.bounds.z = bounds.z;
    this.array = [];
    this.fillArray();
  }

  setArray(array: number[] | Uint8Array) {
    this.array = array;
  }

  fillArray(value = 0) {
    for (let i = 0; i < this.volumne; i++) {
      this.array[i] = value;
    }
  }

  getValue(x: number, y: number, z: number) {
    return this.array[
      x + y * this.bounds.x + z * this.bounds.z * this.bounds.y
    ];
  }
  getValueUseObj(position: Position3Matrix) {
    return this.array[
      position.x +
        position.y * this.bounds.x +
        position.z * this.bounds.z * this.bounds.y
    ];
  }

  setValue(x: number, y: number, z: number, value: number) {
    this.array[x + y * this.bounds.x + z * this.bounds.z * this.bounds.y] =
      value;
  }
  setValueUseObj(position: Position3Matrix, value: number) {
    this.array[
      position.x +
        position.y * this.bounds.x +
        position.z * this.bounds.z * this.bounds.y
    ] = value;
  }

  deleteValue(x: number, y: number, z: number) {
    //@ts-ignore
    this.array[x + y * this.bounds.x + z * this.bounds.z * this.bounds.y] =
      undefined;
  }
  deleteUseObj(position: Position3Matrix) {
    //@ts-ignore
    this.array[
      position.x +
        position.y * this.bounds.x +
        position.z * this.bounds.z * this.bounds.y
    ] = undefined;
  }
  getIndex(x: number, y: number, z: number) {
    return x + y * this.bounds.x + z * this.bounds.z * this.bounds.y;
  }
  getXYZ(index: number): Position3Matrix {
    this._position.x = index % this.bounds.x >> 0;
    this._position.y = (index / this.bounds.x) % this.bounds.y >> 0;
    this._position.z = (index / (this.bounds.x * this.bounds.y)) >> 0;
    return this._position;
  }
}
