import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from '../schema/tables.schema';
import { TableRowDTO } from '../dto/table-row.dto';
import { ValidateRow } from 'src/shared/row.validator';
import { validate } from 'uuid';

@Injectable()
export class TablesRowService {

    constructor(
        @InjectModel(Table.name)
        private readonly tableModel: Model<TableDocument>,
        private rowValidator: ValidateRow
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

        try {
            await this.rowValidator.validate(data, table);
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        data = new TableRowDTO(data);

        await this.tableModel.findOneAndUpdate({ _id }, {
            $push: {
                rows: data
            }
        });

        return (await this.findById(_id)).rows.find(r => r.r_id == data.r_id);
    }

    async update(_id: Types.ObjectId, rowId: string, data: Partial<TableRowDTO>) {
        const table = await this.findById(_id);

        const row = table.rows.find(row => row.r_id == rowId);
        if (!row) throw new HttpException('Row not found in table', HttpStatus.CONFLICT);

        try {
            await this.rowValidator.validate({ ...row, ...data, r_id: row.r_id }, table)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        
        data = new TableRowDTO(data);
        console.log(data);

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

        return (await this.findById(_id)).rows.find(r => r.r_id == rowId);
    }

    async delete(_id: Types.ObjectId, row_id: string) {
        const table = await this.tableModel.findOneAndUpdate({ _id },
            {
                $pull: {
                    rows: {
                        r_id: row_id
                    }
                }
            }
        );
        if (!table) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);

        return { ok: true, n: 1, _id, row_id };
    }
}