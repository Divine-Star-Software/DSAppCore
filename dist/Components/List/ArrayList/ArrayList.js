import { div, button, AddClass, element, AddEvents, AddAttributes, } from "elmtree";
import "./ArrayList.css";
import { Icons } from "../../icons.js";
export const ArrayList = (props) => {
    const indexMap = new Map();
    const childern = [];
    const arrayListID = crypto.randomUUID();
    for (let i = 0; i < props.items.length; i++) {
        const node = props.items[i];
        const nodeKey = `${crypto.randomUUID()}-${i}-array-list`;
        indexMap.set(nodeKey, node);
        childern.push([
            div("array-list-item " + arrayListID, [
                ...props.format(node),
                div("array-list-buttons", [
                    props.getButtons(node).map((b) => {
                        if (b.icon) {
                            return element("button", [
                                AddEvents({
                                    click: () => {
                                        b.onClick();
                                    },
                                }),
                                AddClass(["array-list-button"]),
                            ], div("array-list-icon", [
                                {
                                    type: "rawHTML",
                                    rawHTML: Icons[b.icon],
                                },
                            ]));
                        }
                        if (b.text) {
                            return button(b.text, b.onClick, [
                                AddClass(["array-list-button"]),
                            ]);
                        }
                        return [];
                    }),
                ]),
            ], [
                AddAttributes({
                    draggable: true,
                    id: nodeKey,
                    dataset: {
                        dataid: nodeKey,
                    },
                }),
                AddEvents({
                    dragstart: (event) => {
                        if (!event.dataTransfer)
                            return;
                        const currentIndex = indexMap.get(nodeKey);
                        event.dataTransfer.setData("index", String(currentIndex));
                        event.dataTransfer.setData("id", nodeKey);
                        event.dataTransfer.dropEffect = "move";
                    },
                    dragend: () => { },
                    dragover: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    },
                    dragenter: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    },
                    drop: (event) => {
                        if (!event.dataTransfer)
                            return;
                        let current = event.target;
                        const maxSearch = 100;
                        let i = 0;
                        while (current.parentElement) {
                            if (current.classList.contains("array-list-item"))
                                break;
                            current = current.parentElement;
                            i++;
                            if (i > maxSearch)
                                break;
                        }
                        if (!current.classList.contains("array-list-item"))
                            return;
                        const id = event.dataTransfer.getData("id");
                        const elm = document.getElementById(id);
                        current.after(elm);
                        const items = props.items;
                        const elms = document.getElementsByClassName(arrayListID);
                        props.items = [];
                        let count = 0;
                        for (const elm of elms) {
                            const nodeId = elm.dataset["dataid"];
                            if (!nodeId)
                                continue;
                            props.items.push(indexMap.get(nodeId));
                            count++;
                        }
                        items.forEach((_, i) => { });
                        props.onUpdate(props.items);
                    },
                }),
            ]),
        ]);
    }
    return element("div", [AddClass([`array-list`, ...props.claasses])], childern);
};
