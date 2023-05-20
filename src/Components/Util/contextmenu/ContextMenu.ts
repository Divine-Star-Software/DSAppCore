import { CreateState } from "crystalline-state";
import {
  AddAttributes,
  AddClass,
  AddEvents,
  Component,
  element,
  ElmTreeData,
  UseCascade,
} from "elmtree";
import "./ContextMenu.css";
const cascade = UseCascade({
  mousePosition: [0, 0],
});
const [component, update] = Component();

const [CONTEXT_MENU_EVENTS, CONTEXT_MENU_STATE] = CreateState({
  mode: "tool-tip",
  visible: false,
  elements: <ElmTreeData>[],
});

CONTEXT_MENU_EVENTS("elements", "set", (newvalue) => {
  update(newvalue);
  cascade.runCascade();
  return true;
});
CONTEXT_MENU_EVENTS("visible", "change", () => {
  cascade.runCascade();
});
CONTEXT_MENU_EVENTS("mode", "change", (newValue) => {
  cascade.runCascade();
  if (newValue == "edit") {
    snapShot.x = cascade.props.mousePosition[0];
    snapShot.y = cascade.props.mousePosition[1];
  }
});

const snapShot = {
  x: 0,
  y: 0,
};
export function ContentMenuElement(): ElmTreeData {
  return element(
    "div",

    [
      AddAttributes({
        //@ts-ignore
        style: {
          display: "none",
        },
      }),
      AddClass(["context-menu"]),
      cascade.addToElment((elm: HTMLElement) => {
        if (!CONTEXT_MENU_STATE.visible) {
          elm.style.display = "none";
          return;
        }
        const rect = elm.getBoundingClientRect();
        let left = cascade.props.mousePosition[0];
        let top = cascade.props.mousePosition[1];
        if (ContextMenu.state.mode == "tool-tip") {
          left += 150;
          if (left > window.innerWidth / 2) {
            left -= rect.width;
            left -= 250;
          }
          if (top > window.innerHeight / 2) {
            top -= rect.height / 2;
          }
        }
        if (ContextMenu.state.mode == "edit") {
          left = snapShot.x;
          top = snapShot.y;
          left -= 150;
          top -= 150;
          if (left > window.innerWidth / 2) {
            left -= rect.width / 2;
          }
          if (top > window.innerHeight / 2) {
            top -= rect.height / 2;
          }
        }
        elm.setAttribute(
          "style",
          `display:block; left:${left}px; top:${top}px;${
            ContextMenu.style ? ContextMenu.style : ""
          }`
        );
      }),
    ],
    [component]
  );
}

window.addEventListener("mousemove", (ev) => {
  if (ContextMenu.dead) return;
  cascade.props.mousePosition[0] = ev.pageX;
  cascade.props.mousePosition[1] = ev.pageY;
  snapShot.x = cascade.props.mousePosition[0];
  snapShot.y = cascade.props.mousePosition[1];
  if (CONTEXT_MENU_STATE.visible && CONTEXT_MENU_STATE.mode == "tool-tip") {
    cascade.runCascade();
  }
});

export type ContextMenuButtons = {
  name: string;
  action: Function;
}[];

export const ContextMenu = {
  activeId: "",
  state: CONTEXT_MENU_STATE,
  events: CONTEXT_MENU_EVENTS,
  setElements(elements: ElmTreeData) {
    this.state.elements = elements;
  },
  style: <false | string>false,
  setActive(active: boolean) {
    this.state.visible = active;
  },
  dead: false,
  isActive() {
    return this.state.visible == true;
  },
  setButtons(buttons: ContextMenuButtons) {
    const elms: ElmTreeData = [];
    for (const button of buttons) {
      elms.push(
        element(
          "button",
          [
            AddClass(["context-menu-button"]),
            AddEvents({
              click: () => {
                button.action();
              },
            }),
          ],
          button.name
        )
      );
    }

    this.setElements(elms);
  },
};
