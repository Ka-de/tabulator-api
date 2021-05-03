import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Column } from 'src/columns/schema/columns.schema';
import { Row } from 'src/rows/schema/rows.schema';

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
                description: String,
                attributes: {}
            }
        ], default: []
    })
    columns: Column[];

    @Prop({ type: [], default: [] })
    rows: Row[];

    @Prop()
    author: Types.ObjectId;

    @Prop()
    editor: Types.ObjectId;
}

export type TableDocument = Table & Document;
export const TableSchema = SchemaFactory.createForClass(Table);