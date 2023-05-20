import { ObjectStore } from "zeneithdb";
export declare class ObjectStoreAccessNode<T> {
    id: string;
    store: ObjectStore<ArrayBuffer>;
    constructor(id: string);
    get(): Promise<T | false>;
    set(data: T): Promise<void>;
}
export declare class MapStoreAccessNode<K, V> {
    id: string;
    store: ObjectStore<ArrayBuffer>;
    constructor(id: string);
    get(): Promise<Map<K, V> | false>;
    set(map: Map<K, V>): Promise<void>;
}
export declare class CollectionAccessNode<K, V> {
    collection: ObjectStore<V>;
    getKey: (key: K) => string;
    constructor(collection: ObjectStore<V>, getKey: (key: K) => string);
    get(id: K): Promise<false | V>;
    remove(id: K): Promise<boolean>;
    set(id: K, value: V): Promise<boolean>;
}
export declare class BinaryCollectionAccessNode<K, V> {
    collection: ObjectStore<ArrayBuffer>;
    getKey: (key: K) => string;
    constructor(collection: ObjectStore<ArrayBuffer>, getKey: (key: K) => string);
    get(id: K): Promise<V | false>;
    remove(id: K): Promise<boolean>;
    set(id: K, value: V): Promise<boolean>;
}
