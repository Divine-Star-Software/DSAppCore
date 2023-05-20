import { ElmTreeData } from "elmtree";
import "./ArrayList.css";
import { Icons } from "../../icons.js";
export declare const ArrayList: <T>(props: {
    format: (data: T) => ElmTreeData;
    getButtons: (data: T) => {
        text?: string;
        icon?: keyof typeof Icons;
        onClick: Function;
    }[];
    claasses: string[];
    items: T[];
    onUpdate: (data: T[]) => void;
}) => ElmTreeData;
