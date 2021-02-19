import { TableDataTypes } from "../models/tables.model";

export interface TableColumnDTO {
    name: string;
    datatype: TableDataTypes;
    required?: boolean;
    unique?: boolean;
}