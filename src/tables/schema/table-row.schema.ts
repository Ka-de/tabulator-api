import { Prop, Schema } from "@nestjs/mongoose";
import { TableColumnDTO } from "../dto/tables-column.dto";
import { TableColumnEntity } from "../models/tables.model";

@Schema({ _id: true })
export class TableRow {
    @Prop()
    r_id: string;

    constructor(data: any, columns: TableColumnDTO[]) {
        const columnEntity: TableColumnEntity<TableColumnDTO> = columns.reduce((acc, column) =>
            ({ ...acc, [column.name]: column }), {});

        for (let i in columnEntity) {
            this[i] = data[i];
        }
    }
}
export type TableRowDocument = TableRow & Document;
