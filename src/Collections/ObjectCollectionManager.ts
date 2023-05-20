import type { ObjectCollection } from "./ObjectCollection";
import {
  AddAttributes,
  AddEvents,
  AddInputBind,
  div,
  element,
  ElmTreeData,
  GetForm,
  title,
  UseCascade,
} from "elmtree";
import { FormBuilderElements } from "elmtree/Elements/Forms/FormBuilder.types";
import "./CollectionScreen.css";
import {
  CollectionEditType,
  ObjectCollectionData,
} from "./ObjectCollection.types";
import { Vec2Array, Vec3Array } from "divine-voxel-engine/Math";
import { CollectionEditor } from "./ObjectCollectionEditor";
const vectorInput = (
  bind: Record<string, any>,
  property: keyof typeof bind,
  editor: CollectionEditor,
  inputIndex: number,
  value: number[],
  node: ObjectCollectionData
) => {
  return div("vector-input-group", [
    element("label", [], `${property.toUpperCase()}:`),
    element("input", [
      AddAttributes({
        input: {
          type: "number",
          value: String(value[inputIndex]),
        },
      }),
      AddInputBind({
        bindTo: bind,
        objectPropertyName: property,
        valueType: "number",
      }),
      AddEvents({
        input: () => {
          editor.bindTo[node.id][inputIndex] = bind[property];
          editor.collection.update(node.id, editor.bindTo[node.id]);
        },
      }),
    ]),
  ]);
};
export const ObjectCollectionManager = {
  editorTypes: new Map<string, CollectionEditType>([
    [
      "color",
      {
        id: "color",
        getElements(node, editor) {
          if (node.input?.type != "color") return false;
          return {
            type: "text-input",
            bindTo: node.id,
            label: node.name,
            addons: [
              editor.update.addToElment((elm) => {
                elm.value = node.input!.default;
                editor.collection.update(node.id, <number>node.input!.default);
                editor.bindTo[node.id] = node.input!.default;
              }),
              AddAttributes({
                input: {
                  type: "color",
                  value: editor.collection.get(node.id),
                },
              }),
              AddEvents({
                input: () => {
                  editor.collection.update(node.id, editor.bindTo[node.id]);
                },
              }),
            ],
          };
        },
      },
    ],
    [
      "vec2",
      {
        id: "vec2",
        getElements(node, editor) {
          if (node.input?.type != "vec2") return false;
          const value: Vec2Array = editor.collection.get(node.id);
          editor.bindTo[node.id] = [value[0], value[1]];
          const bind = { x: 0, y: 0, z: 0 };
          return {
            type: "elmtree-obj",
            data: [
              div("form-group", [
                div("form-label", [element("label", [], node.name)]),
                div("vector-input", [
                  vectorInput(
                    bind,
                    node.input.valueType == "position" ? "x" : "w",
                    editor,
                    0,
                    value,
                    node
                  ),
                  vectorInput(
                    bind,
                    node.input.valueType == "position" ? "y" : "h",
                    editor,
                    1,
                    value,
                    node
                  ),
                ]),
              ]),
            ],
          };
        },
      },
    ],
    [
      "vec3",
      {
        id: "vec3",
        getElements(node, editor) {
          if (node.input?.type != "vec3") return false;
          const value: Vec3Array = editor.collection.get(node.id);
          editor.bindTo[node.id] = [value[0], value[1], value[2]];
          const bind = { x: 0, y: 0, z: 0 };

          return {
            type: "elmtree-obj",
            data: [
              div("form-group", [
                div("form-label", [element("label", [], node.name)]),
                div("vector-input", [
                  vectorInput(
                    bind,
                    node.input.valueType == "position" ? "x" : "w",
                    editor,
                    0,
                    value,
                    node
                  ),
                  vectorInput(
                    bind,
                    node.input.valueType == "position" ? "y" : "h",
                    editor,
                    1,
                    value,
                    node
                  ),
                  vectorInput(
                    bind,
                    node.input.valueType == "position" ? "z" : "d",
                    editor,
                    2,
                    value,
                    node
                  ),
                ]),
              ]),
            ],
          };
        },
      },
    ],
    [
      "int",
      {
        id: "int",
        getElements(node, editor) {
          if (node.input?.type != "int") return false;
          return {
            type: "number-input",
            bindTo: node.id,
            label: node.name,
            addons: [
              editor.update.addToElment((elm) => {
                elm.value = node.input!.default;
                editor.collection.update(node.id, <number>node.input!.default);
                editor.bindTo[node.id] = node.input!.default;
              }),
              AddAttributes({
                input: {
                  type: "number",
                  min: String(node.input.min),
                  max: String(node.input.max),
                  value: editor.collection.get(node.id),
                },
              }),
              AddEvents({
                input: () => {
                  editor.collection.update(node.id, editor.bindTo[node.id]);
                },
              }),
            ],
          };
        },
      },
    ],
    [
      "float",
      {
        id: "float",
        getElements(node, editor) {
          if (node.input?.type != "float") return false;
          return {
            type: "number-input",
            bindTo: node.id,
            label: node.name,
            addons: [
              editor.update.addToElment((elm) => {
                elm.value = node.input!.default;
                editor.collection.update(node.id, <number>node.input!.default);
                editor.bindTo[node.id] = node.input!.default;
              }),
              AddAttributes({
                input: {
                  type: "number",
                  min: String(node.input.min),
                  max: String(node.input.max),
                  value: editor.collection.get(node.id),
                },
              }),
              AddEvents({
                input: () => {
                  editor.collection.update(node.id, editor.bindTo[node.id]);
                },
              }),
            ],
          };
        },
      },
    ],
    [
      "range",
      {
        id: "range",
        getElements(node, editor) {
          if (node.input?.type != "range") return false;
          return {
            type: "number-input",
            bindTo: node.id,
            label: node.name,
            addons: [
              editor.update.addToElment((elm) => {
                elm.value = node.input!.default;
                editor.collection.update(node.id, <number>node.input!.default);
                editor.bindTo[node.id] = node.input!.default;
              }),
              AddAttributes({
                input: {
                  type: "range",
                  min: String(node.input.min),
                  max: String(node.input.max),
                  step: String(node.input.step),
                  value: editor.collection.get(node.id),
                },
              }),
              AddEvents({
                input: () => {
                  editor.collection.update(node.id, editor.bindTo[node.id]);
                },
              }),
            ],
          };
        },
      },
    ],

    [
      "string",
      {
        id: "string",
        getElements(node, editor) {
          if (node.input?.type != "string") return false;
          return {
            type: "text-input",
            bindTo: node.id,
            label: node.name,
            addons: [
              editor.update.addToElment((elm) => {
                elm.value = node.input!.default;
                editor.collection.update(node.id, <number>node.input!.default);
                editor.bindTo[node.id] = node.input!.default;
              }),
              AddAttributes({
                input: {
                  type: "text",
                  minLength: node.input.min,
                  maxLength: node.input.max,
                  value: editor.collection.get(node.id),
                },
              }),
              AddEvents({
                input: () => {
                  editor.collection.update(node.id, editor.bindTo[node.id]);
                },
              }),
            ],
          };
        },
      },
    ],

    [
      "select",
      {
        id: "string",
        getElements(node, editor) {
          if (node.input?.type != "select") return false;
          return {
            type: "radio-input",
            bindTo: node.id,
            label: node.name,
            onChange: (input) => {
              editor.collection.update(node.id, editor.bindTo[node.id]);
            },
            data: node.input.options.map(([name, value]) => {
              return {
                active: node.input!.default == value,
                text: name,
                value: value,
              };
            }),
          };
        },
      },
    ],
  ]),
  addEditorType(data: CollectionEditType) {
    this.editorTypes.set(data.id, data);
  },
};
