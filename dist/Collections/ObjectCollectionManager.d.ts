import "./CollectionScreen.css";
import { CollectionEditType } from "./ObjectCollection.types";
export declare const ObjectCollectionManager: {
    editorTypes: Map<string, CollectionEditType>;
    addEditorType(data: CollectionEditType): void;
};
