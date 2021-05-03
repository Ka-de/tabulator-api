import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ColumnEntity } from "src/columns/models/column.entity";
import { ColumnDTO } from "src/columns/models/columns.dto";

@Schema({ _id: true })
export class Row {
    @Prop()
    r_id: string;

    constructor(data: any, columns: ColumnDTO[]) {
        const columnEntity: ColumnEntity<ColumnDTO> = columns.reduce((acc, column) =>
            ({ ...acc, [column.name]: column }), {});

        for (let i in columnEntity) {
            this[i] = data[i];
        }
    }
}
export type RowDocument = Row & Document;
export const RowSchema = SchemaFactory.createForClass(Row);
