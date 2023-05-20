export declare const CJSON: {
    defalte(data: any): Promise<ArrayBuffer>;
    inflate<T = any>(buffer: ArrayBuffer): Promise<T>;
};
