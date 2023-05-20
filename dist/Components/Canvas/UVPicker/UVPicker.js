import "./UVPicker.css";
import { VoxelSpaces } from "voxelspaces";
import { div } from "elmtree";
const space = VoxelSpaces.getVoxelSpaces();
export class UVPicker {
    canvas = document.createElement("canvas");
    context;
    textureSize = { width: 32, height: 32 };
    _pixelSize = 8;
    selection = { ex: 5, ey: 5, sx: 0, sy: 0 };
    uv = { ws: 0, we: 1, hs: 0, he: 1 };
    _onUpdate = new Map();
    _currentImage = new Uint8ClampedArray(4 * 2 * 2);
    _convert(value) {
        return Math.abs(value) / this._pixelSize;
    }
    constructor() {
        this.canvas.className = "layer-canvas";
        this.context = this.canvas.getContext("2d", { willReadFrequently: true });
        this.context.imageSmoothingEnabled = false;
        let dreaggin = false;
        const listender = () => {
            dreaggin = false;
            this.drawAll();
            this.uv.ws = this._convert(this.selection.sx);
            this.uv.we = this._convert(this.selection.ex);
            this.uv.hs = this._convert(this.selection.sy);
            this.uv.he = this._convert(this.selection.ey);
            this._onUpdate.forEach((_) => _(this));
            window.removeEventListener("mousedown", listender);
        };
        this.canvas.addEventListener("mousedown", (e) => {
            dreaggin = true;
            const { x, y, z } = space.chunk.getPositionXYZ(e.offsetX, e.offsetY, 0);
            this.selection.sx = x;
            this.selection.sy = y;
            this.drawAll();
            window.addEventListener("mouseup", listender);
        });
        this.canvas.addEventListener("mousemove", (e) => {
            if (dreaggin) {
                const { x, y, z } = space.chunk.getPositionXYZ(e.offsetX, e.offsetY + this._pixelSize, 0);
                this.selection.ex = x;
                this.selection.ey = y;
                this.drawAll();
            }
        });
        this.setPixelSize(this._pixelSize);
    }
    setPixelSize(size) {
        this._pixelSize = size;
        const power = Math.log2(size);
        space.setDimensions({
            regions: { x: power, y: power, z: power },
            chunks: { x: power, y: power, z: power },
            columns: { x: power, y: power, z: power },
        });
    }
    registerOnUpdate(id, run) {
        this._onUpdate.set(id, run);
    }
    removeFromOnUpdate(id) {
        this._onUpdate.delete(id);
    }
    async setCurrentImage(image) {
        this._currentImage = image;
        await this.drawAll();
    }
    async _drawImage(texture) {
        const bitmap = await createImageBitmap(new ImageData(texture, Math.sqrt(texture.length / 4), Math.sqrt(texture.length / 4)), {
            resizeWidth: this.canvas.width,
            resizeHeight: this.canvas.height,
            resizeQuality: "pixelated",
        });
        this.context.drawImage(bitmap, 0, 0, this.canvas.width, this.canvas.height);
    }
    async drawAll() {
        let width = this.textureSize.width * this._pixelSize;
        let height = this.textureSize.width * this._pixelSize;
        this.context.clearRect(0, 0, width, height);
        this.context.strokeStyle = "rgba(0.5, 0.5, 0.5, 0.1)";
        await this._drawImage(this._currentImage);
        for (let x = 0; x < width; x += this._pixelSize) {
            for (let y = 0; y < height; y += this._pixelSize) {
                this.context.strokeRect(x, y, this._pixelSize, this._pixelSize);
            }
        }
        this.context.fillStyle = "rgba(0.5, 0.5, 0.5, 0.5)";
        this.context.fillRect(this.selection.sx, this.selection.sy, this.selection.ex - this.selection.sx, this.selection.ey - this.selection.sy);
    }
    update(data) {
        this.textureSize = data;
        this.canvas.width = data.width * this._pixelSize;
        this.canvas.height = data.height * this._pixelSize;
        this.selection.sx = data.selectionStart[0] * this._pixelSize;
        this.selection.sy = data.selectionStart[1] * this._pixelSize;
        this.selection.ex = data.selectionEnd[0] * this._pixelSize;
        this.selection.ey = data.selectionEnd[1] * this._pixelSize;
        this.drawAll();
    }
    store() {
        return {
            start: [this.uv.ws, this.uv.hs],
            end: [this.uv.we, this.uv.he],
        };
    }
    render() {
        return div("uv-picker", [
            {
                type: "rawElement",
                element: this.canvas,
            },
        ]);
    }
}
