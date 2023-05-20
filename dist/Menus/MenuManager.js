import { ScreenManager } from "../Screens/ScreenManager.js";
import { Component, AddAttributes, UseCascade, div, AddEvents, } from "elmtree";
import "./Menu.css";
import { ObjectIndex } from "../Indexing/ObjectIndex.js";
class MenuManager {
    data;
    static menuManagers = new Map();
    static destoryAll() {
        MenuManager.menuManagers.forEach((_) => _.destroy());
        MenuManager.menuManagers.clear();
    }
    static _processNodeAction(action) {
        switch (action.action) {
            case "enter-screen":
                const screen = ScreenManager.getScreenManager(action.screenManagerId);
                if (screen)
                    screen.update(action.screen, action.screenMode);
                break;
            case "custom":
                action.run();
                break;
        }
    }
    _nodeIndex = new ObjectIndex([
        {
            property: ["id"],
        },
    ]);
    _updateComponent;
    _menuComponent;
    _cascade = UseCascade({
        active: true,
    });
    _menuSections = new Map();
    _state = {
        node: "",
        section: "",
    };
    _connectMenuState(node) {
        return this._cascade.addToElment((elm) => {
            let active = false;
            if ((this._state.node == node.id && node.type == "single") ||
                (this._state.section == node.id && node.type == "section")) {
                active = true;
            }
            if (active) {
                elm.classList.remove("inactive");
                elm.classList.add("active");
            }
            else {
                elm.classList.add("inactive");
                elm.classList.remove("active");
            }
        });
    }
    _updateState(node, runAction = true) {
        if (node.type == "single") {
            this._state.node = node.id;
            if (!node._sub)
                this._state.section = "";
            if (runAction)
                MenuManager._processNodeAction(node.action);
        }
        if (node.type == "section") {
            this._state.node = node.childern[0].id;
            if (node.childern[0].type == "single")
                if (runAction)
                    MenuManager._processNodeAction(node.childern[0].action);
            this._state.section = node.id;
        }
        this._cascade.runCascade();
    }
    menuElements = {
        single: (node, sub = false) => {
            return this.data.formatSingle(node, [
                AddAttributes({
                    className: `${sub ? "sub-" : ""}menu-button ${this._state.node == node.id ? "active" : ""}`,
                    tabIndex: 0,
                }),
                this._connectMenuState(node),
                AddEvents({
                    click: (event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        this._updateState(node);
                    },
                    keydown: (event) => {
                        if (event.key == " " || event.key == "Enter") {
                            this._updateState(node);
                        }
                    },
                }),
            ]);
        },
        section: (node) => {
            if (node.type != "section")
                return [];
            return [
                this.data.formatSection(node, [
                    AddAttributes({
                        tabIndex: 0,
                        className: `menu-button ${node.id == this._state.section ? "active" : ""}`,
                    }),
                    this._connectMenuState(node),
                    AddEvents({
                        click: (event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            this._updateState(node);
                        },
                        keydown: (event) => {
                            if (event.key == " " || event.key == "Enter") {
                                this._updateState(node);
                            }
                        },
                    }),
                ]),
                div("sub-menu-section inactive", node.childern.map((value) => this.menuElements.single(value, true)), [
                    AddAttributes({
                        tabIndex: 0,
                    }),
                    this._connectMenuState(node),
                ]),
            ];
        },
    };
    constructor(data) {
        this.data = data;
        const [screenCompoent, screenUpdate] = Component({
            addons: [
                AddAttributes({
                    id: this.data.id,
                }),
            ],
        });
        this._updateComponent = screenUpdate;
        this._menuComponent = screenCompoent;
    }
    destroy() {
        MenuManager.menuManagers.delete(this.data.id);
    }
    render() {
        return this.data.formatMenu(this._menuComponent);
    }
    setActiveNode(sectionId, id) {
        const section = this._menuSections.get(sectionId);
        if (!section)
            throw new Error(`Section with id ${sectionId} does not exits on ${this.data.id}`);
        const node = this._nodeIndex.getFiltered([[["id"], id]])[0];
        if (node)
            this._updateState(node, false);
    }
    runNodeAction(sectionId, id) {
        const section = this._menuSections.get(sectionId);
        if (!section)
            throw new Error(`Section with id ${sectionId} does not exits on ${this.data.id}`);
        const node = this._nodeIndex.getFiltered([[["id"], id]])[0];
        if (node)
            this._updateState(node, true);
    }
    addToMenuSection(id, nodes) {
        let menuSection = this._menuSections.get(id);
        if (!menuSection) {
            menuSection = [];
        }
        nodes.forEach((_) => {
            this._nodeIndex.addToIndex(_);
            if (_.type == "section") {
                _.childern.forEach((c) => {
                    this._nodeIndex.addToIndex(c);
                    if (c.type == "single") {
                        c._sub = true;
                    }
                });
            }
        });
        menuSection = [...menuSection, ...nodes];
        this._menuSections.set(id, menuSection);
    }
    _renderNode(node) {
        if (node.type == "single") {
            return this.menuElements.single(node);
        }
        if (node.type == "section") {
            return this.menuElements.section(node);
        }
        return [];
    }
    renderSection(id) {
        if (!this._menuSections.has(id))
            throw new Error(`Menu section with ${id} does not exits on ${this.data.id}.`);
        this._updateComponent(this._menuSections.get(id).map((_) => this._renderNode(_)));
    }
}
export { MenuManager };
