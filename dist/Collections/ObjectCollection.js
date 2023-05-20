export class ObjectCollection {
    save;
    _nodes = new Map();
    _groups = new Map();
    constructor(save) {
        this.save = save;
    }
    addGroups(groups) {
        for (const group of groups) {
            this._groups.set(group.id, { data: group, nodes: new Map() });
        }
    }
    addNodes(nodes) {
        for (const node of nodes) {
            this._nodes.set(node.id, {
                data: node,
                value: node?.input?.default,
            });
            const group = this._groups.get(node.groupId);
            if (!group) {
                throw new Error(`Group with id:${node.groupId} does not exist.`);
            }
            group.nodes.set(node.id, node);
        }
    }
    update(id, value) {
        const nodes = this._nodes.get(id);
        if (!nodes)
            return false;
        if (nodes.data.input?.beforeStore) {
            //@ts-ignore
            value = nodes.data.input.beforeStore(value);
        }
        nodes.value = value;
        if (!nodes.data.input?.onUpdate)
            return;
        //@ts-ignore
        nodes.data.input.onUpdate(nodes.value);
    }
    get(id) {
        const nodes = this._nodes.get(id);
        if (typeof nodes === "undefined") {
            throw new Error(`Node with id: ${id} does not exists in the object collection.`);
        }
        let value = nodes.value;
        return value;
    }
    store() {
        const seralized = [];
        for (const [key, data] of this._nodes) {
            let value = data.value;
            if (data.data.input) {
                if (data.data.input.beforeStore) {
                    //@ts-ignore
                    value = data.data.input.beforeStore(value);
                }
            }
            seralized.push([key, value]);
        }
        return seralized;
    }
    loadIn(data) {
        for (const [key, value] of data) {
            const nodes = this._nodes.get(key);
            if (!nodes)
                continue;
            nodes.value = value;
            if (!nodes.data.input?.onUpdate)
                continue;
            //@ts-ignore
            nodes.data.input.onUpdate(nodes.value);
        }
    }
    restoreDefaults() {
        for (const [key, data] of this._nodes) {
            if (data.data.input) {
                data.value = data.data.input.default;
            }
        }
    }
}
