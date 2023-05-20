import { ElmTreeData } from "elmtree";
import "./SelectList.css";
import { Icons } from "../../icons.js";
export declare const SelectList: <T>(props: {
    format: (data: T) => ElmTreeData;
    getButtons: (data: T) => {
        text?: string;
        icon?: keyof typeof Icons;
        onClick: Function;
    }[];
    claasses: string[];
    items: T[];
}) => ElmTreeData;
