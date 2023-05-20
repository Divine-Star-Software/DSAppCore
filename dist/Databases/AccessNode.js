import { CJSON } from "../Util/CJSON.js";
export class ObjectStoreAccessNode {
    id;
    store;
    constructor(id) {
        this.id = id;
    }
    async get() {
        const rawData = await this.store.get(this.id);
        if (!rawData)
            return false;
        return await CJSON.inflate(rawData);
    }
    async set(data) {
        const compressed = await CJSON.defalte(data);
        this.store.set(this.id, compressed);
    }
}
export class MapStoreAccessNode {
    id;
    store;
    constructor(id) {
        this.id = id;
    }
    async get() {
        const rawData = await this.store.get(this.id);
        if (!rawData)
            return false;
        const json = await CJSON.inflate(rawData);
        return new Map(json);
    }
    async set(map) {
        const seralized = [];
        for (const [k, v] of map) {
            seralized.push([k, v]);
        }
        const compressed = await CJSON.defalte(seralized);
        this.store.set(this.id, compressed);
    }
}
export class CollectionAccessNode {
    collection;
    getKey;
    constructor(collection, getKey) {
        this.collection = collection;
        this.getKey = getKey;
    }
    async get(id) {
        return this.collection.get(this.getKey(id));
    }
    async remove(id) {
        return this.collection.delete(this.getKey(id));
    }
    async set(id, value) {
        return this.collection.set(this.getKey(id), value);
    }
}
export class BinaryCollectionAccessNode {
    collection;
    getKey;
    constructor(collection, getKey) {
        this.collection = collection;
        this.getKey = getKey;
    }
    async get(id) {
        const data = await this.collection.get(this.getKey(id));
        if (!data)
            return false;
        return await CJSON.inflate(data);
    }
    async remove(id) {
        return this.collection.delete(this.getKey(id));
    }
    async set(id, value) {
        const deflated = await CJSON.defalte(value);
        return this.collection.set(this.getKey(id), deflated);
    }
}
