import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from '../schema/tables.schema';
import { TableDataTypes } from '../models/tables.model';
import { TableColumnCloneDTO, TableColumnDTO } from '../dto/tables-column.dto';
import { TablesService } from './tables.service';

@Injectable()
export class TablesColumnService {

    validateColumnDatatype(value: any) {
        if (!Object.values(TableDataTypes).includes(value)) throw new HttpException('Column datatype is not allowed', HttpStatus.FORBIDDEN);
    }

    constructor(
        @InjectModel(Table.name)
        private readonly tableModel: Model<TableDocument>,
        private tableService: TablesService
    ) { }

    async find(_id: Types.ObjectId) {
        const table = await this.tableService.findById(_id);
        return table.columns;
    }

    async findById(_id: Types.ObjectId, column_id: Types.ObjectId) {
        const table = await this.tableService.findById(_id);

        const column = table.columns.find(c => c._id == column_id);
        if (!column) throw new HttpException('Column in table not found', HttpStatus.NOT_FOUND);

        return column;
    }

    async create(_id: Types.ObjectId, data: TableColumnDTO) {
        //require name and datatype
        if (!data.name) throw new HttpException('Column name is required', HttpStatus.BAD_REQUEST);
        if (!data.datatype) throw new HttpException('Column datatype is required', HttpStatus.BAD_REQUEST);
        this.validateColumnDatatype(data.datatype);//validate the datatype

        const found = await this.tableModel.findOne({ 'columns.name': data.name });//check if name has been used
        if (found) throw new HttpException('Column with name already exists in table', HttpStatus.CONFLICT);

        //create column by updating table
        const table = await this.tableModel.findOneAndUpdate({ _id }, { $push: { columns: data } });
        if (!table) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);

        return (await this.tableService.findById(_id)).columns.find(c => c.name == data.name);
    }

    async update(
        _id: Types.ObjectId,
        columnId: Types.ObjectId,
        data: Partial<TableColumnDTO>
    ) {
        const table = await this.tableService.findById(_id);
        const column = table.columns.find(c => c._id == columnId);//does column exist?
        if (!column) throw new HttpException('Column not found in table', HttpStatus.CONFLICT);

        if (data.name) {
            const found = table.columns.find(c => c.name == data.name && c._id != columnId);
            if (found) throw new HttpException('Column with name already exists in table', HttpStatus.CONFLICT);
        }//does column with name exist?

        if (data.datatype) this.validateColumnDatatype(data.datatype);//is datatype valid?

        const columnUpdate: any = {};
        for (let i in data) {
            columnUpdate[`columns.$.${i}`] = data[i];
        }//set the column update

        await this.tableModel.findOneAndUpdate(
            { _id, 'columns._id': columnId },
            {
                $set: columnUpdate,
            }
        );//update the column

        if (data.name) {
            const rows = table.rows.map(r => {
                let value = r[column.name];
                delete r[column.name];

                r[data.name] = value;
                return r;
            });

            await this.tableModel.findOneAndUpdate(
                { _id },
                { rows }
            );
        }//rename the rows if the column name changed

        return (await this.findById(_id, columnId));
    }

    async clone(_id: Types.ObjectId, data: TableColumnCloneDTO) {
        //require name and datatype
        if (!data.name) throw new HttpException('Column name is required', HttpStatus.BAD_REQUEST);
        if (!data.datatype) throw new HttpException('Column datatype is required', HttpStatus.BAD_REQUEST);
        this.validateColumnDatatype(data.datatype);//validate the datatype

        const found = await this.tableModel.findOne({ 'columns.name': data.name });//check if name has been used
        if (found) throw new HttpException('Column with name already exists in table', HttpStatus.CONFLICT);

        //create column by updating table
        const table = await this.tableModel.findOneAndUpdate({ _id }, { $push: { columns: data } });
        if (!table) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);

        if (data.withrows) {
            table.rows = table.rows.map(row => {                
                return { ...row, [data.name]: row[data.from] }
            });            

            await this.tableModel.findOneAndUpdate({ _id }, { rows: table.rows });
        }

        return (await this.tableService.findById(_id));
    }

    async delete(_id: Types.ObjectId, column_id: Types.ObjectId) {
        const table = await this.tableModel.findOneAndUpdate(
            { _id },
            {
                $pull: {
                    columns: {
                        _id: column_id
                    }
                }
            }
        );
        if (!table) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);

        return { ok: true, n: 1, _id, column_id };
    }
}