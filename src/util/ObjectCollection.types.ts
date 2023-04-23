
export type ObjectCollectionGroupData = {
  id: string;
  name: string;
};

export type ObjectCollectionInputs =
  | ({
      type: "color";
    } & ObjectCollectionInputBase<string>)
  | ({
      type: "range";
      min: number;
      max: number;
      step: number;
    } & ObjectCollectionInputBase<number>)
  | ({
      type: "float";
      min: number;
      max: number;
    } & ObjectCollectionInputBase<number>)
  | ({
      type: "vec3";
      valueType: "position" | "dimension";
    } & ObjectCollectionInputBase<[x : number, y : number, z: number]>)
  | ({
      type: "vec2";
      valueType: "position" | "dimension";
    } & ObjectCollectionInputBase<[x : number, z :  number]>)
  | ({
      type: "int";
      min: number;
      max: number;
    } & ObjectCollectionInputBase<number>)
  | ({
      type: "color";
    } & ObjectCollectionInputBase<number>)
  | ({
      type: "string";
      min: number;
      max: number;
    } & ObjectCollectionInputBase<string>)
  | ({
      type: "select";
      options: [title: string, value: string][];
    } & ObjectCollectionInputBase<string>)
  | ({
      type: "file-path";
      acceptedFileExtensions: string[];
    } & ObjectCollectionInputBase<string>)


type ObjectCollectionInputBase<T> = {
  default: T;
  onUpdate?: (newValue: T) => void;
  beforeStore?: (newValue: T) => any;
};
export type ObjectCollectionDataTypes =
  | "string"
  | "number"
  | "vec3"
  | "boolean"
  | "json";
export type ObjectCollectionData = {
  id: string;
  groupId: string;
  name: string;
  input?: ObjectCollectionInputs;
  //storeAs: ObjectCollectionDataTypes;
  editable?: boolean;
};

export type StoredCollection = [string, any][];
