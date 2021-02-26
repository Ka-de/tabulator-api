import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { TableDataTypes } from "../models/tables.model";

@Schema({ timestamps: true })
export class TableColumn {
    @Prop()
    _id: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    datatype: TableDataTypes;

    @Prop()
    description?: string;

    @Prop()
    required?: boolean;

    @Prop()
    unique?: boolean;
}
export type TableColumnDocument = TableColumn & Document;

