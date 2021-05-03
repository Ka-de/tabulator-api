import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose'; import { TableDTO, TableEditable } from './models/tables.dto';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
    constructor(
        private tablesService: TablesService
    ) {
    }

    @Get()
    find() {
        return this.tablesService.find();
    }

    @Get(':id')
    findById(@Param('id') id: Types.ObjectId) {
        return this.tablesService.findById(id);
    }

    @Post()
    create(@Body() data: TableDTO) {
        return this.tablesService.create(data);
    }

    @Patch(':id')
    update(@Param('id') id: Types.ObjectId, @Body() data: Partial<TableEditable>) {
        return this.tablesService.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: Types.ObjectId) {
        return this.tablesService.delete(id);
    }
}
