import {
  ObjectCollectionData,
  ObjectCollectionGroupData,
  StoredCollection,
} from "./ObjectCollection.types";

export class ObjectCollection {
  _nodes: Map<
    string,
    {
      value: any;
      data: ObjectCollectionData;
    }
  > = new Map();
  _groups: Map<
    string,
    {
      data: ObjectCollectionGroupData;
      nodes: Map<string, ObjectCollectionData>;
    }
  > = new Map();

  constructor(public save: () => Promise<void>) {}

  addGroups(groups: ObjectCollectionGroupData[]) {
    for (const group of groups) {
      this._groups.set(group.id, { data: group, nodes: new Map() });
    }
  }

  addNodes(nodes: ObjectCollectionData[]) {
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

  update<T = any>(id: string, value: T) {
    const nodes = this._nodes.get(id);
    if (!nodes) return false;
    if (nodes.data.input?.beforeStore) {
      //@ts-ignore
      value = nodes.data.input.beforeStore(value);
    }
    nodes.value = value;
    if (!nodes.data.input?.onUpdate) return;
    //@ts-ignore
    nodes.data.input.onUpdate(nodes.value);
  }

  get<T = any>(id: string) {
    const nodes = this._nodes.get(id);
    if (typeof nodes === "undefined") {
      throw new Error(
        `Node with id: ${id} does not exists in the object collection.`
      );
    }
    let value = nodes.value;
    return <T>value;
  }

  store() {
    const seralized: StoredCollection = [];
    for (const [key, data] of this._nodes) {
      let value = data.value;
      if (data.data.input) {
        if (data.data.input.beforeStore) {
          //@ts-ignore
          value = data.data.input.beforeStore(value as any);
        }
      }
      seralized.push([key, value]);
    }
    return seralized;
  }

  loadIn(data: StoredCollection) {
    for (const [key, value] of data) {
      const nodes = this._nodes.get(key);
      if (!nodes) continue;
      nodes.value = value;
      if (!nodes.data.input?.onUpdate) continue;
      //@ts-ignore
      nodes.data.input.onUpdate(<any>nodes.value);
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
