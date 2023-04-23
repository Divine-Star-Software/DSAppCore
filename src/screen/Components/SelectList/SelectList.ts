import {
  ElmTreeData,
  div,
  button,
  AddClass,
  element,
  AddEvents,
} from "elmtree";
import "./SelectList.css";
import { Icons } from "../icons";
export const SelectList = <T>(props: {
  format: (data: T) => ElmTreeData;
  getButtons: (data: T) => {
    text?: string;
    icon?: keyof typeof Icons;
    onClick: Function;
  }[];
  claasses: string[];
  items: T[];
}) =>
  element(
    "div",
    [AddClass([`select-list`, ...props.claasses])],
    props.items.map((node) =>
      div("select-list-item", [
        ...props.format(node),
        div("select-list-buttons", [
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
                  AddClass(["select-list-button"]),
                ],
                div("select-list-icon", [
                  {
                    type: "rawHTML",
                    rawHTML: Icons[b.icon],
                  },
                ])
              );
            }
            if (b.text) {
              return button(b.text, b.onClick, [
                AddClass(["select-list-button"]),
              ]);
            }
            return [];
          }),
        ]),
      ])
    )
  );
