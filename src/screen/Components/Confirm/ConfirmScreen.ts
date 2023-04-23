import { GetForm, div } from "elmtree";
import { FormBuilderElements } from "elmtree/Elements/Forms/FormBuilder.types";
import "./ConfirmScreen.css";
export const ConfirmScreen = (data: {
  title: string;
  text?: string;
  buttons: {
    text: string;
    onClick: Function;
  }[];
}) =>
  div("confirm-screen", [
    GetForm({
      inputBind: {},
      elements: [
        {
          type: "title",
          text: data.title,
        },
        //@ts-ignore
        ...(data.text
          ? <FormBuilderElements<any>[]>[
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
