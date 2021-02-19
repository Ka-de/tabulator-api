import { HttpException, HttpStatus } from "@nestjs/common";
import { TableColumnDTO } from "./tables-column.dto";
import { TableColumnEntity } from "../models/tables.model";
import { Table } from "../schema/tables.schema";
import { v4 as uuidv4 } from 'uuid';

export class TableRowDTO {
    r_id: string;
    constructor(data: TableRowDTO | Partial<TableRowDTO>, table: Table) {       
        this.r_id = data.r_id;

        const columnEntity: TableColumnEntity<TableColumnDTO> = table.columns.reduce((acc, column) =>
            ({ ...acc, [column.name]: column }), {});
        for (let i in columnEntity) {
            if (i == 'r_id') continue;
            if (columnEntity[i].required && !data[i]) throw new HttpException(`${i} is required in table row`, HttpStatus.NOT_FOUND);

            if (columnEntity[i].unique) {
                const found = table.rows.find(u => {
                    return (u[i] != data[i])
                        ? false
                        : !data.r_id
                            ? true
                            : data.r_id == u.r_id
                                ? false
                                : true;
                });
                if (found) throw new HttpException(`${i} is unique in table`, HttpStatus.NOT_FOUND);
            }

            this[i] = data[i];
        }
        
        this.r_id = this.r_id || uuidv4();
    }
}