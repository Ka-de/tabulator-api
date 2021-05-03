import { Body, Controller, Delete, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { RowDTO } from './models/row.dto';
import { RowsService } from './rows.service';

@Controller('rows')
export class RowsController {
    constructor(
        private rowService: RowsService
    ) { }

    @Post()
    create(
        @Query('table') table: Types.ObjectId,
        @Body() data: RowDTO
    ) {
        return this.rowService.create(table, data);
    }

    @Patch('/:id')
    update(
        @Query('table') table: Types.ObjectId,
        @Param('id') id: string,
        @Body() data: Partial<RowDTO>
    ) {
        return this.rowService.update(table, id, data);
    }

    @Delete('/:id')
    delete(
        @Query('table') table: Types.ObjectId,
        @Param('id') id: string,
    ) {
        return this.rowService.delete(table, id);
    }
}
