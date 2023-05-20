import { GetForm, div } from "elmtree";
import "./ConfirmScreen.css";
export const ConfirmScreen = (data) => div("confirm-screen", [
    GetForm({
        inputBind: {},
        elements: [
            {
                type: "title",
                text: data.title,
            },
            //@ts-ignore
            ...(data.text
                ? [
                    {
                        type: "text",
                        text: data.text,
                    },
                ]
                : []),
            //@ts-ignore
            {
                type: "button-group",
                //@ts-ignore
                buttons: data.buttons.map((b) => {
                    return {
                        type: "button",
                        text: b.text,
                        onClick: b.onClick,
                    };
                }),
            },
        ],
    }),
]);
