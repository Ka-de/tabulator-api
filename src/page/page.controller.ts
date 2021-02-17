import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Type } from '@nestjs/common';
import { Types } from 'mongoose';
import { PageDTO } from './dto/page.dto';
import { PageService } from './page.service';

@Controller('pages')
export class PageController {

    constructor(
        private pageService: PageService
    ) { }

    @Post()
    create(@Body() page: PageDTO) {
        return this.pageService.create(page);
    }

    @Patch(':id')
    update(@Param('id') id: Types.ObjectId, @Body() data: Partial<PageDTO>) {
        return this.pageService.update(id, data);
    }

    @Get()
    find(@Query('id') id: Types.ObjectId) {
        if(id){
            return this.pageService.findById(id);
        }
        else{
            return this.pageService.find();
        }
    }

    @Get(':id')
    get(@Param('id') id: Types.ObjectId) {
        return this.pageService.findById(id);
    }

    @Delete(':id')
    delete(@Param('id') id: Types.ObjectId) {
        return this.pageService.delete(id);
    }
}
