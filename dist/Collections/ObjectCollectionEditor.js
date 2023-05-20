import { div, GetForm, title, UseCascade, } from "elmtree";
import "./CollectionScreen.css";
import { ObjectCollectionManager } from "./ObjectCollectionManager.js";
export class CollectionEditor {
    collection;
    update = UseCascade();
    bindTo = {};
    constructor(collection) {
        this.collection = collection;
    }
    render() {
        const elms = [];
        const controlGroups = this.collection._groups;
        for (const [gkey, group] of controlGroups) {
            const formElements = [];
            for (const [ckey, node] of group.nodes) {
                if (typeof node.editable !== "undefined" && !node.editable)
                    continue;
                if (!node.input)
                    continue;
                const type = ObjectCollectionManager.editorTypes.get(node.input.type);
                if (!type)
                    continue;
                const elms = type.getElements(node, this);
                if (!elms)
                    continue;
                formElements.push(elms);
            }
            elms.push(div("collection-group", [
                title("h1", group.data.name, "collection-group-title"),
                GetForm({
                    inputBind: this.bindTo,
                    elements: formElements,
                }),
            ]));
        }
        return elms;
    }
}
