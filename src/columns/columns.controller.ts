import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { ColumnsService } from './columns.service';
import { ColumnCloneDTO, ColumnDTO } from './models/columns.dto';

@Controller('columns')
export class ColumnsController {

    constructor(
        private columnService: ColumnsService
    ) { }

    @Get()
    find(@Query("table") table: Types.ObjectId) {
        return this.columnService.find(table);
    }

    @Get("/:id")
    findById(
        @Query("table") table: Types.ObjectId,
        @Param("id") id: Types.ObjectId
    ) {
        return this.columnService.findById(table, id);
    }

    @Post()
    createColumn(
        @Query('table') table: Types.ObjectId,
        @Body() data: ColumnDTO
    ) {
        return this.columnService.create(table, data);
    }

    @Patch(':id')
    updateColumn(
        @Query('table') table: Types.ObjectId,
        @Param('id') id: Types.ObjectId,
        @Body() data: Partial<ColumnDTO>
    ) {
        return this.columnService.update(table, id, data);
    }

    @Put()
    cloneColumn(
        @Query('table') table: Types.ObjectId,
        @Body() data: ColumnCloneDTO
    ) {
        console.log(data);
        
        return this.columnService.clone(table, data);
    }

    @Delete(':id')
    deleteColumn(
        @Query('table') table: Types.ObjectId,
        @Param('id') id: Types.ObjectId,
    ) {
        return this.columnService.delete(table, id);
    }
}
