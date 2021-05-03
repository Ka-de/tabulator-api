import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { TableDataTypes } from "src/tables/models/tables.model";

@Schema({ timestamps: true })
export class Column {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ type: String })
    name: string;

    @Prop({ type: TableDataTypes })
    datatype: TableDataTypes;

    @Prop({ type: String })
    description: string;

    @Prop({ type: Boolean })
    required?: boolean;

    @Prop({ type: Boolean })
    unique?: boolean;

    @Prop({ type: {} })
    attributes?: any;
}
export type ColumnDocument = Column & Document;
export const ColumnSchema = SchemaFactory.createForClass(Column);
