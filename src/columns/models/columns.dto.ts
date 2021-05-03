import { TableDataTypes } from "src/tables/models/tables.model";

export interface ColumnDTO {
    name: string;
    datatype: TableDataTypes;
    attributes?: any;
    description: string;
    required?: boolean;
    unique?: boolean;
    simple: string;
}

export interface ColumnCloneDTO extends ColumnDTO {
    withrows: boolean;
    from: string;
}