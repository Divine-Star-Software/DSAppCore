import { Scene } from "@babylonjs/core/scene.js";
import { Engine } from "@babylonjs/core/Engines/engine.js";
import { Vector3, Vector4 } from "@babylonjs/core/Maths/math.vector.js";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { DVER } from "divine-voxel-engine/Render";
import { div } from "elmtree";
import {
  Color3,
  Effect,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  RawTexture2DArray,
  RenderTargetTexture,
  ShaderMaterial,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

import "./ModelViewer.css";

export class ModelViwer {
  canvas: HTMLCanvasElement = document.createElement("canvas");

  scene: Scene;
  engine: Engine;
  camera: ArcRotateCamera;
  mesh: Mesh | undefined;
  material: ShaderMaterial | undefined;
  textures: RawTexture2DArray[] | undefined;
  rtt: RenderTargetTexture;
  constructor(
    public data: {
      size: [width: number, height: number];
    }
  ) {
    this.canvas.width = data.size[0];
    this.canvas.height = data.size[0];
  }

  async init() {
    const engine = new Engine(this.canvas, false);
    this.engine = engine;
    engine.enableOfflineSupport = false;
    engine.setSize(this.data.size[0], this.data.size[1]);

    const scene = new Scene(engine);
    this.scene = scene;
    scene.fogEnabled = true;

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 3,
      Math.PI / 3,
      0.5,
      new Vector3(0, 0, 0),
      scene
    );
    camera.angularSensibilityX = 300;
    camera.angularSensibilityY = 300;
    this.camera = camera;
    camera.attachControl(this.canvas, true);
    const hemLight = new HemisphericLight("", new Vector3(0, 1, 0), scene);

    camera.inertia = 0.001;
    camera.minZ = 0.001;
    camera.speed = 0.001;
    camera.zoomOnFactor = 0.01;
    scene.activeCamera = camera;
    scene.collisionsEnabled = false;

    scene.clearColor.set(0, 0.4, 0.5, 1);

    this.rtt = new RenderTargetTexture("", 300, scene);
    this.rtt._invertY = false;
    scene.customRenderTargets.push(this.rtt);
    this.rtt.activeCamera = camera;

    engine.runRenderLoop(() => {
      scene.render();
    });
  }

  async getImage() {
    const data = await this.rtt.readPixels();
    return data;
  }

  setMesh(mesh: Mesh) {
    if (this.mesh) this.mesh.dispose();
    this.rtt.renderList!.push(mesh);
    this.mesh = mesh;
    mesh.material = this.material!;
  }

  render() {
    return div("model-viewer", [
      {
        type: "rawElement",
        element: this.canvas,
      },
    ]);
  }
}
