import { AddClass, button, div } from "elmtree";
export function SettingsScreen(collectionEditor) {
    return [
        div("button-group", [
            button("Save Settings", async () => {
                await collectionEditor.collection.save();
            }, [AddClass(["default-button"])]),
            button("Restore Defaults", async () => {
                collectionEditor.update.runCascade();
            }, [AddClass(["default-button"])]),
        ]),
        collectionEditor.render(),
    ];
}
