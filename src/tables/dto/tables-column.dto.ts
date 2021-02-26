import { TableDataTypes } from "../models/tables.model";

export interface TableColumnDTO {
    name: string;
    datatype: TableDataTypes;
    description?: string;
    required?: boolean;
    unique?: boolean;
}