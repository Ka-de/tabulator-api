import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TableColumn } from './table-column.schema';
import { TableRow } from './table-row.schema';

@Schema({ timestamps: true })
export class Table {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop({ default: [] })
    attatchments: string[];

    @Prop()
    length: number;

    @Prop()
    itemsLength: number;

    @Prop()
    version: string;

    @Prop({
        type: [
            {
                name: String,
                datatype: String,
                required: Boolean,
                unique: Boolean,
            }
        ], default: []
    })
    columns: TableColumn[];

    @Prop({ type: [], default: [] })
    rows: TableRow[];

    @Prop()
    author: Types.ObjectId;

    @Prop()
    editor: Types.ObjectId;
}
export type TableDocument = Table & Document;
export const TableSchema = SchemaFactory.createForClass(Table);