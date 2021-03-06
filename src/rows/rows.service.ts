import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ValidateRow } from 'src/shared/row.validator';
import { Table, TableDocument } from 'src/tables/schema/tables.schema';
import { TablesService } from 'src/tables/tables.service';
import { RowDTO } from './models/row.dto';


@Injectable()
export class RowsService {

    constructor(
        @InjectModel(Table.name)
        private readonly tableModel: Model<TableDocument>,
        private tableService: TablesService,
        private rowValidator: ValidateRow,
        private httpService: HttpService
    ) { }

    async find(_id: Types.ObjectId) {
        const table = await this.tableService.findById(_id);
        return table.rows;
    }

    async findById(_id: Types.ObjectId, row_id: string) {
        const table = await this.tableService.findById(_id);
        const row = table.rows.find(r => r.r_id == row_id);//get the row
        if (!row) throw new HttpException('Row in table not found', HttpStatus.NOT_FOUND);

        return row;
    }

    async create(_id: Types.ObjectId, data: RowDTO) {
        const table = await this.tableService.findById(_id);

        try {
            //validate row to match the tables columns
            data = <RowDTO>await this.rowValidator.validate(data, table, this.httpService);
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        data = new RowDTO(data);

        

        //add the row to table as update
        await this.tableModel.findOneAndUpdate({ _id }, {
            $push: {
                rows: data
            }
        });

        //get the created row;
        return (await this.tableModel.findById(_id)).rows.find(r => r.r_id == data.r_id);
    }

    async update(_id: Types.ObjectId, rowId: string, data: Partial<RowDTO>) {
        const table = await this.tableService.findById(_id);

        const row = table.rows.find(row => row.r_id == rowId);
        if (!row) throw new HttpException('Row not found in table', HttpStatus.CONFLICT);

        try {
            //validate row to match the tables columns
            data = <RowDTO>await this.rowValidator.validate({ ...row, ...data, r_id: row.r_id }, table, this.httpService)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }

        data = new RowDTO(data);//convert to a Row data transfer object
        const rowUpdate: any = {};
        for (let i in data) {
            rowUpdate[`rows.$.${i}`] = data[i];
        }//set the update

        //update the row
        await this.tableModel.findOneAndUpdate(
            { _id, 'rows.r_id': rowId },
            {
                $set: rowUpdate
            }
        );

        return (await this.tableModel.findById(_id)).rows.find(r => r.r_id == rowId);
    }

    async delete(_id: Types.ObjectId, row_id: string) {
        //pull the row with the id
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