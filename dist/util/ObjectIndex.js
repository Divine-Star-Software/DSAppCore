export class ObjectIndex {
    indexes = new Map();
    indexMap = new Map();
    constructor(indexes) {
        if (indexes) {
            this.registerIndexes(indexes);
        }
    }
    registerIndexes(data) {
        for (const index of data) {
            this.indexes.set(this._getIndexKey(index.property), {
                data: index,
                index: new Map(),
            });
        }
    }
    _findProperty(data, property) {
        if (typeof data != "object")
            throw new Error(`Data passed to an Object Index must be an object`);
        let finalResult = undefined;
        let parent = data;
        let i = 0;
        for (const node of property) {
            if (parent[node]) {
                finalResult = data[node];
                i++;
                if (i == property.length)
                    break;
                parent = parent[node];
            }
        }
        return finalResult;
    }
    _getIndexKey(property) {
        return property.join("|");
    }
    hasAny(filters) {
        let found = false;
        for (const [property, value] of filters) {
            const index = this.indexes.get(this._getIndexKey(property));
            if (!index)
                continue;
            const set = index.index.get(value);
            if (!set)
                continue;
            if (set.size == 0)
                continue;
            found = true;
        }
        return found;
    }
    getAllWithProperty(filters) {
        const returnData = [];
        for (const [property, value] of filters) {
            const index = this.indexes.get(this._getIndexKey(property));
            if (!index)
                continue;
            const set = index.index.get(value);
            if (!set)
                continue;
            if (set.size == 0)
                continue;
            returnData.push(...set);
        }
        return returnData;
    }
    getFiltered(filters) {
        const returnData = [];
        const filtered = this.getAllWithProperty(filters);
        for (const obj of filtered) {
            if (this.objectFitsFilter(obj, filters)) {
                returnData.push(obj);
            }
        }
        return returnData;
    }
    objectFitsFilter(data, filters) {
        let error = false;
        for (const [property, value] of filters) {
            const objValue = this._findProperty(data, property);
            if (!objValue || objValue != value) {
                error = true;
                break;
            }
        }
        return !error;
    }
    removeFiltered(filters) {
        for (const [property, value] of filters) {
            const index = this.indexes.get(this._getIndexKey(property));
            if (!index)
                continue;
            const set = index.index.get(value);
            if (!set)
                continue;
            if (set.size == 0)
                continue;
            set.clear();
        }
        return true;
    }
    getAll() {
        const getSet = new Set();
        for (const [k1, index] of this.indexes) {
            for (const [k2, set] of index.index) {
                set.forEach((t) => getSet.add(t));
            }
        }
        return [...getSet];
    }
    getIndex(indexProperty) {
        return this.indexes.get(this._getIndexKey(indexProperty));
    }
    getAllObjectsOfIndex(indexProperty) {
        const index = this.getIndex(indexProperty);
        if (!index)
            return [];
        const returnSet = new Set();
        for (const [key, set] of index.index) {
            set.forEach((v) => returnSet.add(v));
        }
        return [...returnSet];
    }
    addToIndex(data) {
        for (const [ik, index] of this.indexes) {
            if (index.data.beforeStore && !index.data.beforeStore(data))
                continue;
            const value = this._findProperty(data, index.data.property);
            if (typeof value !== "undefined") {
                let key = value;
                if (index.data.getKey) {
                    key = index.data.getKey(data);
                }
                let objectIndex = index.index.get(key);
                if (!objectIndex) {
                    objectIndex = new Set();
                    index.index.set(key, objectIndex);
                }
                objectIndex.add(data);
                let indexMap = this.indexMap.get(data);
                if (!indexMap) {
                    indexMap = new Map();
                    this.indexMap.set(data, indexMap);
                }
                indexMap.set(this._getIndexKey(index.data.property), key);
            }
        }
    }
    removeFromIndex(data) {
        const indexMap = this.indexMap.get(data);
        if (!indexMap)
            return false;
        for (const [indexId, indexSegment] of indexMap) {
            const index = this.indexes.get(indexId);
            if (!index)
                continue;
            const set = index.index.get(indexSegment);
            if (!set)
                continue;
            set.delete(data);
        }
        return true;
    }
    clear() {
        for (const [k1, index] of this.indexes) {
            for (const [k2, set] of index.index) {
                set.clear();
            }
            index.index.clear();
        }
    }
}
