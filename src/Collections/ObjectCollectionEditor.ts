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

import { ObjectCollectionManager } from "./ObjectCollectionManager.js";

export class CollectionEditor {
  update = UseCascade();
  bindTo: Record<string, any> = {};

  constructor(public collection: ObjectCollection) {}

  render() {
    const elms: ElmTreeData = [];
    const controlGroups = this.collection._groups;
    for (const [gkey, group] of controlGroups) {
      const formElements: FormBuilderElements<Record<string, any>>[] = [];
      for (const [ckey, node] of group.nodes) {
        if (typeof node.editable !== "undefined" && !node.editable) continue;
        if (!node.input) continue;
        const type = ObjectCollectionManager.editorTypes.get(node.input.type);
        if (!type) continue;
        const elms = type.getElements(node, this);
        if (!elms) continue;
        formElements.push(elms);
      }
      elms.push(
        div("collection-group", [
          title("h1", group.data.name, "collection-group-title"),
          GetForm({
            inputBind: <any>this.bindTo,
            elements: formElements,
          }),
        ])
      );
    }
    return elms;
  }
}
