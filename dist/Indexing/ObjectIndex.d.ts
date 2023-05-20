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
export declare class ObjectIndex<T extends object> {
    indexes: Map<string, {
        data: ObjectIndexData<T>;
        index: Map<string | number, Set<T>>;
    }>;
    indexMap: Map<T, Map<string, string | number>>;
    constructor(indexes?: ObjectIndexData<T>[]);
    registerIndexes(data: ObjectIndexData<T>[]): void;
    _findProperty(data: any, property: ObjectIndexKey): any;
    _getIndexKey(property: ObjectIndexKey): string;
    hasAny(filters: ObjectIndexFilters): boolean;
    getAllWithProperty(filters: ObjectIndexFilters): T[];
    getFiltered(filters: ObjectIndexFilters): T[];
    objectFitsFilter(data: T, filters: ObjectIndexFilters): boolean;
    removeFiltered(filters: ObjectIndexFilters): boolean;
    getAll(): T[];
    getIndex(indexProperty: ObjectIndexKey): {
        data: ObjectIndexData<T>;
        index: Map<string | number, Set<T>>;
    } | undefined;
    getAllObjectsOfIndex(indexProperty: ObjectIndexKey): T[];
    addToIndex(data: T): void;
    removeFromIndex(data: T): boolean;
    clear(): void;
}
