import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from '../schema/tables.schema';
import { TableRowDTO } from '../dto/table-row.dto';

@Injectable()
export class TablesRowService {

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

    async create(_id: Types.ObjectId, data: TableRowDTO) {
        const table = await this.findById(_id);
        data = new TableRowDTO(data, table);
        await this.tableModel.findOneAndUpdate({ _id }, {
            $push: {
                rows: data
            }
        });

        return (await this.findById(_id)).rows;
    }

    async update(_id: Types.ObjectId, rowId: string, data: Partial<TableRowDTO>) {
        const table = await this.findById(_id);

        const row = table.rows.find(row => row.r_id == rowId);
        if (!row) throw new HttpException('Row not found in table', HttpStatus.CONFLICT);

        data = new TableRowDTO({ ...row, ...data, r_id: row.r_id }, table);
        const rowUpdate: any = {};
        for (let i in data) {
            rowUpdate[`rows.$.${i}`] = data[i];
        }//set the update

        await this.tableModel.findOneAndUpdate(
            { _id, 'rows.r_id': rowId },
            {
                $set: rowUpdate
            }
        );

        return (await this.findById(_id)).rows;
    }

    async delete(_id: Types.ObjectId, rowId: string) {
        const table = await this.tableModel.findOneAndUpdate({ _id },
            {
                $pull: {
                    rows: {
                        r_id: rowId
                    }
                }
            }
        );
        if (!table) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);

        return (await this.findById(_id)).rows;
    }
}