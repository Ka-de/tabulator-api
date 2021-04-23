import { Body, Controller, Delete, Get, HttpService, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthenticationGuard } from 'src/shared/authentication.guard';
import { TableRowDTO } from './dto/table-row.dto';
import { TableColumnCloneDTO, TableColumnDTO } from './dto/tables-column.dto';
import { TableDTO, TableEditable } from './dto/tables.dto';
import { TablesColumnService } from './services/tables-column.service';
import { TablesRowService } from './services/tables-row.service';
import { TablesService } from './services/tables.service';

@Controller('tables')
export class TablesController {
    constructor(
        private tablesService: TablesService,
        private tablesColumnService: TablesColumnService,
        private tablesRowService: TablesRowService,
    ) {         
    }

    @Get()
    @UseGuards(new AuthenticationGuard())
    find() {
        return this.tablesService.find();
    }

    @Get(':id')
    @UseGuards(new AuthenticationGuard())
    findById(@Param('id') id: Types.ObjectId) {
        return this.tablesService.findById(id);
    }

    @Post()
    @UseGuards(new AuthenticationGuard())
    create(@Body() data: TableDTO) {
        return this.tablesService.create(data);
    }

    @Patch(':id')
    @UseGuards(new AuthenticationGuard())
    update(@Param('id') id: Types.ObjectId, @Body() data: Partial<TableEditable>) {
        return this.tablesService.update(id, data);
    }

    @Delete(':id')
    @UseGuards(new AuthenticationGuard())
    delete(@Param('id') id: Types.ObjectId) {
        return this.tablesService.delete(id);
    }

    @Post(':id/columns')
    @UseGuards(new AuthenticationGuard())
    createColumn(
        @Param('id') id: Types.ObjectId,
        @Body() data: TableColumnDTO
    ) {
        return this.tablesColumnService.create(id, data);
    }

    @Patch(':id/columns/:columnId')
    @UseGuards(new AuthenticationGuard())
    updateColumn(
        @Param('id') id: Types.ObjectId,
        @Param('columnId') columnId: Types.ObjectId,
        @Body() data: Partial<TableColumnDTO>
    ) {
        return this.tablesColumnService.update(id, columnId, data);
    }

    @Put(':id/columns')
    @UseGuards(new AuthenticationGuard())
    cloneColumn(
        @Param('id') id: Types.ObjectId,
        @Body() data: TableColumnCloneDTO
    ) {
        return this.tablesColumnService.clone(id, data);
    }

    @Delete(':id/columns/:columnId')
    @UseGuards(new AuthenticationGuard())
    deleteColumn(
        @Param('id') id: Types.ObjectId,
        @Param('columnId') columnId: Types.ObjectId,
    ) {
        return this.tablesColumnService.delete(id, columnId);
    }

    @Post(':id/rows')
    @UseGuards(new AuthenticationGuard())
    createRow(
        @Param('id') id: Types.ObjectId,
        @Body() data: TableRowDTO
    ) {
        return this.tablesRowService.create(id, data);
    }

    @Patch(':id/rows/:rowId')
    @UseGuards(new AuthenticationGuard())
    updateRow(
        @Param('id') id: Types.ObjectId,
        @Param('rowId') rowId: string,
        @Body() data: Partial<TableRowDTO>
    ) {
        return this.tablesRowService.update(id, rowId, data);
    }

    @Delete(':id/rows/:rowId')
    @UseGuards(new AuthenticationGuard())
    deleteRow(
        @Param('id') id: Types.ObjectId,
        @Param('rowId') rowId: string,
    ) {
        return this.tablesRowService.delete(id, rowId);
    }
}
