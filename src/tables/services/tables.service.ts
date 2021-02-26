import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TableDTO, TableEditable } from '../dto/tables.dto';
import { Table, TableDocument } from '../schema/tables.schema';
import { TableDataTypes } from '../models/tables.model';

@Injectable()
export class TablesService {

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

    async create(data: TableDTO) {
        const found = await this.tableModel.findOne({ title: data.title });
        if (found) throw new HttpException('Table with title already exists', HttpStatus.NOT_FOUND);

        const model = new this.tableModel(data);
        const newTable = await model.save();

        return newTable;
    }

    async update(_id: Types.ObjectId, data: Partial<TableEditable>) {
        const found = await this.tableModel.findOne({ _id });
        if (!found) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);

        const tables = await this.tableModel.find();

        if (data.title) {
            const checkTitle = tables.find(t => t.title == data.title && t._id != _id);
            if (checkTitle) throw new HttpException('Table with title already exists', HttpStatus.NOT_FOUND);
        }

        await this.tableModel.findOneAndUpdate({ _id }, { $set: data });

        return data;
    }

    async delete(_id: Types.ObjectId) {
        const table = await this.findById(_id);
        if (!table) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);

        const done = await this.tableModel.deleteOne({ _id });
        return { ...done, _id };
    }
}