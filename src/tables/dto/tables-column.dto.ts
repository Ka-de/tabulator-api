import { TableDataTypes } from "../models/tables.model";

export interface TableColumnDTO {
    name: string;
    datatype: TableDataTypes;
    attributes?: any;
    description: string;
    required?: boolean;
    unique?: boolean;
    simple: string;
}

export interface TableColumnCloneDTO extends TableColumnDTO {
    withrows: boolean;
    from: string;
}