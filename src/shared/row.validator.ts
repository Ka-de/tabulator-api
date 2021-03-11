import { TableRowDTO } from "src/tables/dto/table-row.dto";
import { TableColumnEntity, TableDataTypes } from "src/tables/models/tables.model";
import { TableColumn } from "src/tables/schema/table-column.schema";
import { Table } from "src/tables/schema/tables.schema";

export class ValidateRow {
    constructor(
    ) { }

    async validate(
        data: TableRowDTO | Partial<TableRowDTO>,
        table: Table
    ) {
        const columnEntity: TableColumnEntity<TableColumn> = table.columns.reduce((acc, column) =>
            ({ ...acc, [column.name]: column }), {});//name column with column.name
        for (let i in columnEntity) {
            if (columnEntity[i].unique) {//check if unique cells has duplicates
                const found = table.rows.find(u => {
                    return ((u as any)[i] != (data as any)[i])
                        ? false
                        : !data.r_id
                            ? true
                            : data.r_id == u.r_id
                                ? false
                                : true;
                });
                if (found) {
                    return Promise.reject(`${i} is unique in table`);
                }
            }
            
            try {
                await this.isRequired((data as any)[i], columnEntity[i]);//make sure required cells are defined
                await this.isType((data as any)[i], columnEntity[i]);//check for type correctness
            } catch (error) {
                return Promise.reject(error);
            }
        }

        return data;
    }

    isRequired(data: any, column: TableColumn) {
        if (column.required && !data && data !== 0) {
            return Promise.reject(`${column.name} is required in table row`);
        }

        return;
    }

    isType(data: any, column: TableColumn) {
        if (!data && !column.required) return;//make sure defined data use the datatype formart

        if (column.datatype == TableDataTypes.TEXT) {
            if (typeof data !== 'string') {
                return Promise.reject(`${column.name} in table is a ${column.datatype}`);
            }

            if (data.length > 255) {//max of 255 characters
                return Promise.reject(`${column.name} is a ${column.datatype}, and must not be more than 255 characters`);
            }
        }
        else if (column.datatype == TableDataTypes.LONGTEXT) {
            if (typeof data !== 'string') {
                return Promise.reject(`${column.name} in table is a ${column.datatype}`);
            }

            if (column.attributes?.maxLines) {//check for maxLines
                const lines = data.split('\n');
                const numberOfLines = lines.length;

                if (column.attributes.maxLines > numberOfLines) {
                    return Promise.reject(`${column.name} in table has a max-length ${column.attributes.maxLines}, ands was exceeded`);
                }
            }
        }
        else if (column.datatype == TableDataTypes.NUMBER) {
            if (typeof data !== 'number') {
                return Promise.reject(`${column.name} in table is a ${column.datatype}`);
            }
        }
        else if (column.datatype == TableDataTypes.BOOLEAN) {
            if (typeof data !== 'boolean') {
                return Promise.reject(`${column.name} in table is a ${column.datatype}`);
            }
        }
        else if (column.datatype == TableDataTypes.DATETIME) {
            if (new Date(data).toDateString() == 'Invalid Date') {
                return Promise.reject(`${column.name} is a ${column.datatype}, and it's not a valid date and time`);
            }
        }
        else if (column.datatype == TableDataTypes.TIME) {
            const [h, m] = (data as string).split(':');//checkfor Hour and Min
            if (!h || !m) {
                return Promise.reject(`${column.name} is a ${column.datatype}, and it's not a valid time`);
            }
        }
        else if (column.datatype == TableDataTypes.DATE) {
            if (new Date(data).toDateString() == 'Invalid Date') {
                return Promise.reject(`${column.name} is a ${column.datatype}, and it's not a valid date`);
            }
        }
        else if (column.datatype == TableDataTypes.MONEY) {
            const { currency, amount } = data;
            if (!currency || !amount) {
                return Promise.reject(`${column.name} in table is a ${column.datatype}`);
            }

            if (typeof amount != "number") {//make sure the money is decimal value
                return Promise.reject(`${column.name} in table is a ${column.datatype}, but amount is not a valid money value`);
            }
        }
        else if (column.datatype == TableDataTypes.URL) {
            try {
                new URL(data);//make sure it's a valid URL
            } catch (error) {
                return Promise.reject(`${column.name} in table is a ${column.datatype}, but the value is not a valid URL`);
            }
        }

        return;
    }
}