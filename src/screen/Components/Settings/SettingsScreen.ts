import { ObjectCollection } from "@util/ObjectCollection";
import { AddClass, button, div } from "elmtree";
import { CollectionEditor } from "../Collection/CollectionEdit";

export function SettingsScreen(collectionEditor: CollectionEditor) {
  return [
    div("button-group", [
      button(
        "Save Settings",
        async () => {
          await collectionEditor.collection.save();
        },
        [AddClass(["default-button"])]
      ),
      button(
        "Restore Defaults",
        async () => {
          collectionEditor.update.runCascade();
        },
        [AddClass(["default-button"])]
      ),
    ]),
    collectionEditor.render(),
  ];
}
