import {
  ElmTreeData,
  Component,
  AddClass,
  AddAttributes,
  UseCascade,
  ComponentUpdate,
} from "elmtree";

import { wait } from "../Util/Wait.js";

import { ScreenData, ScreenMdeData } from "./Screen.types.js";

export class ScreenManager {
  static MAX_HISTORY_LENGTH = 10;
  static screenManagers = new Map<string, ScreenManager>();
  static destoryAll() {
    ScreenManager.screenManagers.forEach((_) => _.destroy());
    ScreenManager.screenManagers.clear();
  }
  static getScreenManager(id: string) {
    return this.screenManagers.get(id);
  }

  _screenState = {
    screen: "",
    mode: "",
  };
  _history: [screen: string, screenMode: string][] = [];
  _updateComponent: ComponentUpdate<ElmTreeData>;
  _screenComponent: ElmTreeData;
  _cascade = UseCascade({
    enabled: true,
  });

  _enabled = true;
  setEnabled(enabled: boolean) {
    this._enabled = enabled;
    this._cascade.props.enabled = this._enabled;
    this._cascade.runCascade();
  }

  constructor(public id: string) {
    ScreenManager.screenManagers.set(id, this);
    const [screenCompoent, screenUpdate] = Component({
      addons: [
        AddAttributes({
          id: this.id,
        }),
        this._cascade.addToElment(async (elm: HTMLElement, props) => {
          if (props.enabled) {
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
    this._updateComponent = screenUpdate;
    this._screenComponent = screenCompoent;
  }

  destroy() {
    ScreenManager.screenManagers.delete(this.id);
  }

  async update(screen: string, screenMode?: string) {
    if (!screenMode) screenMode = this._screenState.mode;
    if (
      screen == this._screenState.screen &&
      screenMode == this._screenState.mode
    )
      return;
    let newMode = this._screenState.mode;
    if (screenMode != this._screenState.mode) {
      await this.screenModes.render(screenMode);
      this._screenState.mode = screenMode;
      newMode = screenMode;
    }
    let newScreen = this._screenState.screen;
    if (screen != this._screenState.screen) {
      await this.screens.render(screen);
      this._screenState.screen = screen;
      newScreen = screen;
    }
    if (this._history.length > ScreenManager.MAX_HISTORY_LENGTH) {
      while (this._history.length > ScreenManager.MAX_HISTORY_LENGTH - 1) {
        this._history.pop();
      }
    }
    this._history.push([newScreen, newMode]);
  }

  async goBack() {
    this._history.pop();
    const node = this._history.pop();
    if (!node) return;
    await this.update(node[0], node[1]);
  }

  render() {
    return this._screenComponent;
  }

  screenModes = {
    _current: "",
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

    render: async (id: string) => {
      if (this.screenModes._current == id) return;
      const oldId = this.screenModes._current;
      const oldMode = this.screenModes.get(oldId);
      if (oldMode && oldMode.data.onOut && this.screenModes._current) {
        await oldMode.data.onOut();
      }

      this.screenModes._current = id;
      const screenMode = this.screenModes.get(id);
      if (!screenMode) return false;
      const screenElements = await screenMode.data.getElements(
        screenMode.component[0]
      );
      if (screenMode.data.beforeRender) await screenMode.data.beforeRender();

      this._updateComponent(screenElements);
      if (screenMode.data.afterRender) await screenMode.data.afterRender();

      if (screenMode.data.onIn && oldId) {
        await screenMode.data.onIn();
      }
    },
  };

  screens = {
    _currentData: <ScreenData | null>null,
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
    render: async (id: string) => {
      if (this.screens._currentData && this.screens._currentData.id != id) {
        if (this.screens._currentData.onExit)
          await this.screens._currentData.onExit();
        this.screens._currentData = null;
      }
      const screen = this.screens.get(id);
      if (!screen) return false;
      this.screens._currentData = screen;
      const screenMode = this.screenModes.get(this._screenState.mode);
      if (!screenMode) return false;
      if (screenMode.data.beforeUpdate) await screenMode.data.beforeUpdate();
      if (screen.beforeRender) await screen.beforeRender();
      const screenElements = await screen.getElements();
      screenMode.component[1](screenElements);
      if (screen.afterRender) await screen.afterRender();
      if (screenMode.data.afterUpdate) await screenMode.data.afterUpdate();
    },
  };
}
