import { ObjectCollectionData, ObjectCollectionGroupData, StoredCollection } from "./ObjectCollection.types";
export declare class ObjectCollection {
    save: () => Promise<void>;
    _nodes: Map<string, {
        value: any;
        data: ObjectCollectionData;
    }>;
    _groups: Map<string, {
        data: ObjectCollectionGroupData;
        nodes: Map<string, ObjectCollectionData>;
    }>;
    constructor(save: () => Promise<void>);
    addGroups(groups: ObjectCollectionGroupData[]): void;
    addNodes(nodes: ObjectCollectionData[]): void;
    update<T = any>(id: string, value: T): false | undefined;
    get<T = any>(id: string): T;
    store(): StoredCollection;
    loadIn(data: StoredCollection): void;
    restoreDefaults(): void;
}
