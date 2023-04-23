import {
  ElmTreeData,
  div,
  button,
  AddClass,
  element,
  AddEvents,
  AddAttributes,
} from "elmtree";
import "./ArrayList.css";
import { Icons } from "../icons";

export const ArrayList = <T>(props: {
  format: (data: T) => ElmTreeData;
  getButtons: (data: T) => {
    text?: string;
    icon?: keyof typeof Icons;
    onClick: Function;
  }[];
  claasses: string[];
  items: T[];
  onUpdate: (data: T[]) => void;
}) => {
  const indexMap = new Map<any, number>();
  const childern: ElmTreeData = [];
  for (let i = 0; i < props.items.length; i++) {
    const node = props.items[i];

    indexMap.set(node, i);
    const nodeKey = `${crypto.randomUUID()}-${i}-array-list`;
    childern.push([
      div(
        "array-list-item",
        [
          ...props.format(node),
          div("array-list-buttons", [
            props.getButtons(node).map((b) => {
              if (b.icon) {
                return element(
                  "button",
                  [
                    AddEvents({
                      click: () => {
                        b.onClick();
                      },
                    }),
                    AddClass(["array-list-button"]),
                  ],
                  div("array-list-icon", [
                    {
                      type: "rawHTML",
                      rawHTML: Icons[b.icon],
                    },
                  ])
                );
              }
              if (b.text) {
                return button(b.text, b.onClick, [
                  AddClass(["array-list-button"]),
                ]);
              }
              return [];
            }),
          ]),
        ],

        [
          AddAttributes({
            draggable: true,
            id: nodeKey,
          }),
          AddEvents({
            dragstart: (event) => {
              if (!event.dataTransfer) return;
              const currentIndex = indexMap.get(node)!;
              event.dataTransfer.setData("index", String(currentIndex));
              event.dataTransfer.setData("id", nodeKey);
              event.dataTransfer.dropEffect = "move";
            },
            dragend: () => {},
            dragover: (event) => {
              event.preventDefault();
              event.stopPropagation();
            },
            dragenter: (event) => {
              event.preventDefault();
              event.stopPropagation();
            },
            drop: (event) => {
              if (!event.dataTransfer) return;
              const current = <HTMLElement>event.target!;
              if (!current.classList.contains("array-list-item")) return;
              const id = event.dataTransfer.getData("id");
              const currentIndex = Number(event.dataTransfer.getData("index"));
              const newIndex = indexMap.get(node)!;
              if (newIndex == currentIndex || newIndex + 1 == currentIndex)
                return;
              const items = props.items;
              items.splice(newIndex, 0, items.splice(currentIndex, 1)[0]);
              items.forEach((_, i) => {
                indexMap.set(_, i);
              });

              const elm = document.getElementById(id)!;
              props.onUpdate(props.items);

              current.after(elm);
            },
          }),
        ]
      ),
    ]);
  }

  return element(
    "div",
    [AddClass([`array-list`, ...props.claasses])],

    childern
  );
};
