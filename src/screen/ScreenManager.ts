import {
  ElmTreeData,
  Component,
  AddClass,
  BloomRoot,
  AddAttributes,
  UseCascade,
} from "elmtree";


import { wait } from "./Components";


import { ContentMenuElement } from "./Components/contextmenu/ContextMenu";


const SCREEN_STATE : any = {};
type ScreenMdeData = {
  id: string;
  //  appMode: string;
  getElements: (
    screenComponent: ElmTreeData
  ) => ElmTreeData | Promise<ElmTreeData>;

  beforeUpdate?: () => Promise<any>;
  afterUpdate?: () => Promise<any>;

  beforeRender?: () => Promise<any>;
  afterRender?: () => Promise<any>;

  onOut?: () => Promise<any>;
  onIn?: () => Promise<any>;
};

type ScreenData = {
  id: string;
  getElements: () => ElmTreeData | Promise<ElmTreeData>;
  beforeRender?: Function;
  afterRender?: Function;
};

const cascade = UseCascade({
  active: true,
});
const [APP_SCREEN, APP_SCREEN_UPDATE] = Component({
  addons: [
    AddAttributes({
      id: "APP",
    }),
    cascade.addToElment(async (elm: HTMLElement, props) => {
      if (props.active) {
        elm.classList.add("screen-in");
        elm.style.display = "block";
        elm.classList.remove("screen-out");
        await wait(250);
      } else {
        elm.classList.add("screen-out");
        elm.classList.remove("screen-in");
        await wait(250);
        elm.style.display = "none";
      }
    }),
  ],
});

export const ScreenManager = {
  $INIT() {
    BloomRoot([ContentMenuElement(), APP_SCREEN]);
/* 
    UISystem.setShowfunction((show: boolean) => {
      UISystem.active = show;
      cascade.props.active = show;

      cascade.runCascade();
    }); */
  },

  screenModes: {
    _currentMode: "",
    _map: <
      Map<
        string,
        {
          data: ScreenMdeData;
          component: ReturnType<typeof Component>;
        }
      >
    >new Map(),
    add(screenModes: ScreenMdeData[]) {
      for (const screenMode of screenModes) {
        this._map.set(screenMode.id, {
          data: screenMode,
          component: Component({
            addons: [AddClass(["screen"])],
          }),
        });
      }
    },
    get(screenId: string) {
      const screenMode = this._map.get(screenId);
      if (!screenMode) return false;
      return screenMode;
    },

    async render(id: string) {
      if (this._currentMode == id) return;
      const oldId = this._currentMode;
      const oldMode = this.get(oldId);
      if (oldMode && oldMode.data.onOut && this._currentMode) {
        await oldMode.data.onOut();
      }

      this._currentMode = id;
      const screenMode = this.get(id);
      if (!screenMode) return false;
      const screenElements = await screenMode.data.getElements(
        screenMode.component[0]
      );
      if (screenMode.data.beforeRender) await screenMode.data.beforeRender();
      APP_SCREEN_UPDATE(screenElements);
      if (screenMode.data.afterRender) await screenMode.data.afterRender();

      if (screenMode.data.onIn && oldId) {
        await screenMode.data.onIn();
      }
    },
  },

  screens: {
    _map: <Map<string, ScreenData>>new Map(),
    add(screens: ScreenData[]) {
      for (const data of screens) {
        this._map.set(data.id, data);
      }
    },
    get(screenId: string) {
      const data = this._map.get(screenId);
      if (!data) return false;
      return data;
    },
    async render(id: string) {
      const screen = this.get(id);
      if (!screen) return false;
      const screenMode = ScreenManager.screenModes.get(SCREEN_STATE.screenMode);
      if (!screenMode) return false;
      if (screenMode.data.beforeUpdate) await screenMode.data.beforeUpdate();

      if (screen.beforeRender) await screen.beforeRender();
      const screenElements = await screen.getElements();
      screenMode.component[1](screenElements);
      if (screen.afterRender) await screen.afterRender();

      if (screenMode.data.afterUpdate) await screenMode.data.afterUpdate();
    },
  },
};
