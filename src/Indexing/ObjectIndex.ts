export type ObjectIndexKey = (string | number)[];
export type ObjectIndexData<T> = {
  beforeStore?: (data: T) => boolean;
  getKey?: (data: T) => string;
  property: ObjectIndexKey;
};

export type ObjectIndexFilters = [
  property: (string | number)[],
  value: string | number
][];

export class ObjectIndex<T extends object> {
  indexes = new Map<
    string,
    {
      data: ObjectIndexData<T>;
      index: Map<string | number, Set<T>>;
    }
  >();

  indexMap = new Map<T, Map<string, string | number>>();

  constructor(indexes?: ObjectIndexData<T>[]) {
    if (indexes) {
      this.registerIndexes(indexes);
    }
  }

  registerIndexes(data: ObjectIndexData<T>[]) {
    for (const index of data) {
      this.indexes.set(this._getIndexKey(index.property), {
        data: index,
        index: new Map(),
      });
    }
  }

  _findProperty(data: any, property: ObjectIndexKey) {
    if (typeof data != "object")
      throw new Error(`Data passed to an Object Index must be an object`);

    let finalResult: any = undefined;
    let parent = data;
    let i = 0;
    for (const node of property) {
      if (parent[node]) {
        finalResult = data[node];
        i++;
        if (i == property.length) break;
        parent = parent[node];
      }
    }
    return finalResult;
  }

  _getIndexKey(property: ObjectIndexKey) {
    return property.join("|");
  }

  hasAny(filters: ObjectIndexFilters) {
    let found = false;

    for (const [property, value] of filters) {
      const index = this.indexes.get(this._getIndexKey(property));
      if (!index) continue;
      const set = index.index.get(value);
      if (!set) continue;
      if (set.size == 0) continue;
      found = true;
    }
    return found;
  }

  getAllWithProperty(filters: ObjectIndexFilters) {
    const returnData: T[] = [];
    for (const [property, value] of filters) {
      const index = this.indexes.get(this._getIndexKey(property));
      if (!index) continue;
      const set = index.index.get(value);
      if (!set) continue;
      if (set.size == 0) continue;
      returnData.push(...set);
    }
    return returnData;
  }

  getFiltered(filters: ObjectIndexFilters) {
    const returnData: T[] = [];
    const filtered  = this.getAllWithProperty(filters);
    for(const obj of filtered) {
      if(this.objectFitsFilter(obj,filters)) {
        returnData.push(obj)
      }
    }
    return returnData;
  }

  objectFitsFilter(data: T, filters: ObjectIndexFilters) {
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

  removeFiltered(filters: ObjectIndexFilters) {
    for (const [property, value] of filters) {
      const index = this.indexes.get(this._getIndexKey(property));
      if (!index) continue;
      const set = index.index.get(value);
      if (!set) continue;
      if (set.size == 0) continue;
      set.clear();
    }
    return true;
  }

  getAll() {
    const getSet = new Set<T>();
    for (const [k1, index] of this.indexes) {
      for (const [k2, set] of index.index) {
        set.forEach((t) => getSet.add(t));
      }
    }
    return [...getSet];
  }

  getIndex(indexProperty: ObjectIndexKey) {
    return this.indexes.get(this._getIndexKey(indexProperty));
  }

  getAllObjectsOfIndex(indexProperty: ObjectIndexKey) {
    const index = this.getIndex(indexProperty);
    if (!index) return <T[]>[];

    const returnSet = new Set<T>();
    for (const [key, set] of index.index) {
      set.forEach((v) => returnSet.add(v));
    }
    return [...returnSet];
  }

  addToIndex(data: T) {
    for (const [ik, index] of this.indexes) {
      if (index.data.beforeStore && !index.data.beforeStore(data)) continue;
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
          this.indexMap.set(data,indexMap);
        }
        indexMap.set(this._getIndexKey(index.data.property), key);
      }
    }
  }

  removeFromIndex(data: T) {
  
    const indexMap = this.indexMap.get(data);
    
    if (!indexMap) return false;
    for (const [indexId, indexSegment] of indexMap) {

      const index = this.indexes.get(indexId);
      if (!index) continue;
      const set = index.index.get(indexSegment);
     
      if (!set) continue;
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
