import { HttpException, HttpStatus } from "@nestjs/common";
import { TableColumnEntity, TableDataTypes } from "../models/tables.model";
import { Table } from "../schema/tables.schema";
import { v4 as uuidv4 } from 'uuid';
const moment = require('moment');
import * as fromMoment from "moment";
import { TableColumn } from "../schema/table-column.schema";

export class TableRowDTO {
    r_id: string;
    constructor(data: TableRowDTO | Partial<TableRowDTO>, table: Table) {
        this.r_id = data.r_id;

        const columnEntity: TableColumnEntity<TableColumn> = table.columns.reduce((acc, column) =>
            ({ ...acc, [column.name]: column }), {});
        for (let i in columnEntity) {
            if (i == 'r_id') continue;

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

            this.isRequired(data[i], columnEntity[i]);

            this.isType(data[i], columnEntity[i]);

            this[i] = data[i];
        }

        this.r_id = this.r_id || uuidv4();
    }

    isRequired(data: any, column: TableColumn) {
        if (column.required && !data) throw new HttpException(`${column.name} is required in table row`, HttpStatus.NOT_FOUND);
    }

    isType(data: any, column: TableColumn) {
        if (!data && !column.required) return;

        if (column.datatype == TableDataTypes.TEXT) {
            if (typeof data !== 'string') throw new HttpException(`${column.name} in table is a ${column.datatype}`, HttpStatus.NOT_FOUND);

            if (data.length > 255) throw new HttpException(`${column.name} is a ${column.datatype}, and must not be more than 255 characters`, HttpStatus.NOT_FOUND);
        }
        else if (column.datatype == TableDataTypes.LONG_TEXT) {
            if (typeof data !== 'string') throw new HttpException(`${column.name} in table is a ${column.datatype}`, HttpStatus.NOT_FOUND);
        }
        else if (column.datatype == TableDataTypes.NUMBER) {
            if (typeof data !== 'number') throw new HttpException(`${column.name} in table is a ${column.datatype}`, HttpStatus.NOT_FOUND);
        }
        else if (column.datatype == TableDataTypes.BOOLEAN) {
            if (typeof data !== 'boolean') throw new HttpException(`${column.name} in table is a ${column.datatype}`, HttpStatus.NOT_FOUND);
        }
        else if (column.datatype == TableDataTypes.DATETIME) {
            // if (!moment.isDate(date)) throw new HttpException(`${column.name} is a ${column.datatype}, and it's not a valid date and time`, HttpStatus.NOT_FOUND);
        }
        else if (column.datatype == TableDataTypes.TIME) {
            // if (!moment.is(data)) throw new HttpException(`${column.name} is a ${column.datatype}, and it's not a valid date`, HttpStatus.NOT_FOUND);
        }
        else if (column.datatype == TableDataTypes.DATE) {
            // if (!moment.isDate(data)) throw new HttpException(`${column.name} is a ${column.datatype}, and it's not a valid date`, HttpStatus.NOT_FOUND);
        }
    }
}