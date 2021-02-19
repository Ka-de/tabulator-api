import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from '../schema/tables.schema';
import { TableDataTypes } from '../models/tables.model';
import { TableColumnDTO } from '../dto/tables-column.dto';

@Injectable()
export class TablesColumnService {

    validateColumnDatatype(value: any) {
        if (!Object.values(TableDataTypes).includes(value)) throw new HttpException('Column datatype is not allowed', HttpStatus.FORBIDDEN);
    }

    constructor(
        @InjectModel(Table.name)
        private readonly tableModel: Model<TableDocument>
    ) { }

    async find() {
        const Table = await this.tableModel.find();
        return Table;
    }

    async findById(_id: Types.ObjectId) {
        const table = await this.tableModel.findOne({ _id });
        if (!table) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);

        return table;
    }

    async create(_id: Types.ObjectId, data: TableColumnDTO) {
        if (!data.name) throw new HttpException('Column name is required', HttpStatus.BAD_REQUEST);
        if (!data.datatype) throw new HttpException('Column datatype is required', HttpStatus.BAD_REQUEST);
        this.validateColumnDatatype(data.datatype);

        const found = await this.tableModel.findOne({ 'columns.name': data.name });
        if (found) throw new HttpException('Column with name already exists in table', HttpStatus.CONFLICT);

        const table = await this.tableModel.findOneAndUpdate({ _id }, { $push: { columns: data } });
        if (!table) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);

        return (await this.findById(_id)).columns;
    }

    async update(
        _id: Types.ObjectId,
        columnId: Types.ObjectId,
        data: Partial<TableColumnDTO>
    ) {
        const table = await this.findById(_id);

        const column = table.columns.find(c => c._id == columnId);//does column exist?
        if (!column) throw new HttpException('Column not found in table', HttpStatus.CONFLICT);

        if (data.name) {
            const found = table.columns.find(c => c.name == data.name);
            if (found) throw new HttpException('Column with name already exists in table', HttpStatus.CONFLICT);
        }//does column with name exist?

        if (data.datatype) this.validateColumnDatatype(data.datatype);//is datatype valid?

        const columnUpdate: any = {};
        for (let i in data) {
            columnUpdate[`columns.$.${i}`] = data[i];
        }//set the update

        await this.tableModel.findOneAndUpdate(
            { _id, 'columns._id': columnId },
            {
                $set: columnUpdate
            }
        );

        return (await this.findById(_id)).columns;
    }

    async delete(_id: Types.ObjectId, columnId: Types.ObjectId) {
        const table = await this.tableModel.findOneAndUpdate({ _id },
            {
                $pull: {
                    columns: {
                        _id: columnId
                    }
                }
            }
        );
        if (!table) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);

        return (await this.findById(_id)).columns;
    }
}