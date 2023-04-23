import "./LayerPainter.css";
import { VoxelSpaces } from "voxelspaces";
import { Vec3Array } from "divine-voxel-engine/Math";
import { VisitedMap } from "divine-voxel-engine/Global/Util/VisistedMap";
import {
  AddClass,
  AddEvents,
  AddStyles,
  ElmTreeData,
  UseCascade,
  div,
  element,
} from "elmtree";

const space = VoxelSpaces.getVoxelSpaces();
space.setDimensions({
  regions: { x: 4, y: 4, z: 4 },
  chunks: { x: 4, y: 4, z: 4 },
  columns: { x: 4, y: 4, z: 4 },
});

type LayerNodeData = {
  position: Vec3Array;
  nodeId: string;
};

export type LayerNodePaletteData = Record<
  string,
  {
    char: string;
    color: string;
    size: Vec3Array;
    name: string;
  }
>;

export class LayerPainter {
  canvas: HTMLCanvasElement = document.createElement("canvas");
  context: CanvasRenderingContext2D;
  layerSize = { width: 16, height: 16 };

  nodes = new Map<string, LayerNodeData | false>();
  constructor(
    public nodeData: {
      palette: LayerNodePaletteData;
      editable?: boolean;
    }
  ) {
    this.canvas.className = "layer-canvas";
    this.context = this.canvas.getContext("2d", { willReadFrequently: true })!;
    this.context.imageSmoothingEnabled = false;

    if (this.nodeData.editable) {
      const canvas = this.canvas;
      let painting = false;
      let ereasing = false;
      this.canvas.addEventListener("mousedown", (event) => {
        if (event.button == 2) {
          event.preventDefault();
          event.stopPropagation();
          ereasing = true;
          this.clearSectorAt(event.offsetX, event.offsetY);
          return;
        }
        painting = true;
        this.fillSectorAt(event.offsetX, event.offsetY);
      });
      this.canvas.addEventListener("mouseup", (event) => {
        painting = false;
        ereasing = false;
      });

      this.canvas.addEventListener("mousemove", (e) => {
        if (painting) {
          this.fillSectorAt(e.offsetX, e.offsetY);
        }
        if (ereasing) {
          this.clearSectorAt(e.offsetX, e.offsetY);
        }
      });
    }
  }

  fillSectorAt(px: number, py: number) {
    const { x, y, z } = space.chunk.getPositionXYZ(px, py, 0);
    const key = space.chunk.getKey();
    if (this.nodes.get(key)) return;
    if (!this.activeNode) return;
    const newNode: LayerNodeData = {
      nodeId: this.activeNode,
      position: [x, y, z],
    };
    newNode.position = [x, y, z];
    this.nodes.set(space.chunk.getKey(), newNode);
    this.drawAll();
  }

  _visistedMap = new VisitedMap();

  drawNode(x: number, y: number, addToMap = false) {
    const node = this.nodes.get(space.chunk.getKeyXYZ(x, y, 0));
    if (!node) {
      if (!this._visistedMap.inMap(x, y, 0)) {
        this.context.fillStyle = "black";
        this.context.clearRect(x, y, 16, 16);
        this.context.strokeRect(x, y, 16, 16);
      }
      return;
    }
    const nodeData = this.nodeData.palette[node.nodeId];

    let width = nodeData.size[0] * 16;
    let height = nodeData.size[2] * 16;

    for (let sx = x; sx < x + width; sx += 16) {
      for (let sy = y; sy < y + height; sy += 16) {
        if (sx != y && sy != y) {
          if (this.nodes.get(space.chunk.getKeyXYZ(sx, sy, 0))) continue;
        }
        if (addToMap) this._visistedMap.add(sx, sy, 0);
        this.context.fillStyle = nodeData.color;
        this.context.clearRect(sx, sy, 16, 16);
        this.context.fillRect(sx, sy, 16, 16);
      }
    }
  }

  drawAll() {
    let width = this.layerSize.width * 16;
    let height = this.layerSize.width * 16;
    this.context.clearRect(0, 0, width, height);
    for (let x = 0; x < width; x += 16) {
      for (let y = 0; y < height; y += 16) {
        this.drawNode(x, y, true);
        this._visistedMap.add(x, y, 0);
      }
    }
    this._visistedMap.clear();
  }

  clearSectorAt(px: number, py: number) {
    const { x, y, z } = space.chunk.getPositionXYZ(px, py, 0);
    const key = space.chunk.getKey();
    const node = this.nodes.get(key);
    if (!node) return;
    this.nodes.delete(key);
    this.drawAll();
  }

  setSize(data: { width: number; height: number }) {
    this.layerSize = data;
    this.canvas.width = data.width * 16;
    this.canvas.height = data.height * 16;

    let width = data.width * 16;
    let height = data.width * 16;
    this.context.fillStyle = "white";

    for (let x = 0; x < width; x += 16) {
      for (let y = 0; y < height; y += 16) {
        this.context.strokeRect(x, y, 16, 16);
      }
    }
  }

  getData() {
    let matrix: (string | number)[][] = [];

    let width = this.layerSize.width * 16;
    let height = this.layerSize.width * 16;

    let tx = 0;
    for (let x = 0; x < width; x += 16) {
      let ty = 0;
      for (let y = 0; y < height; y += 16) {
        let char: string | number = 0;
        let node = this.nodes.get(space.chunk.getKeyXYZ(x, y, 0));
        if (node) {
          char = this.nodeData.palette[node.nodeId].char;
        }
        matrix[tx] ??= [];
        matrix[tx][ty] = char;
        ty++;
      }
      tx++;
    }

    return matrix;
  }

  import(nodes: LayerNodeData[]) {
    nodes.forEach((_) => {
      this.nodes.set(
        space.chunk.getKeyXYZ(_.position[0], _.position[1], _.position[2]),
        _
      );
    });
    return this;
  }

  store() {
    const nodes: LayerNodeData[] = [];
    this.nodes.forEach((node) => {
      if (!node) return;
      nodes.push(node);
    });
    return nodes;
  }

  updatePalette = UseCascade();
  activeNode = "";

  render() {
    if (!this.nodeData.editable)
      return {
        type: "rawElement",
        element: this.canvas,
      };

    const paletteElms: ElmTreeData = [];

    for (const nodeId in this.nodeData.palette) {
      if (!this.activeNode) this.activeNode = nodeId;
      const node = this.nodeData.palette[nodeId];
      paletteElms.push(
        element(
          "div",
          [
            AddClass([
              "layer-painter-node",
              this.activeNode == nodeId ? "active" : "",
            ]),
            this.updatePalette.addToElment((elm: HTMLElement) => {
              if (this.activeNode == nodeId) {
                elm.classList.add("active");
              } else {
                elm.classList.remove("active");
              }
            }),
            AddEvents({
              click: () => {
                this.activeNode = nodeId;
                console.log("update");
                this.updatePalette.runCascade();
              },
            }),
          ],
          [
            element("div", [
              AddClass([
                "layer-painter-node-color",
                this.activeNode == nodeId ? "active" : "",
              ]),
              //@ts-ignore
              AddStyles({
                width: "50px",
                height: "50px",
                backgroundColor: node.color,
              }),
            ]),
            element(
              "p",
              [AddClass(["layer-painter-node-name"])],
              `${node.name}`
            ),
          ]
        )
      );
    }

    return div("layer-painter", [
      {
        type: "rawElement",
        element: this.canvas,
      },
      div("layer-painter-palette", paletteElms),
    ]);
  }
}
