import { Types } from "mongoose";

export interface TableEditable {
    title: string;
    description: string;
}

export interface TableDTO extends TableEditable {
    attatchments: string[];
    author: Types.ObjectId;
    editor: Types.ObjectId;
}