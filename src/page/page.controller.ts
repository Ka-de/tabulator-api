import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PageDTO } from './page.model';
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
    update(@Param('id') id: string, @Body() data: Partial<PageDTO>) {
        return this.pageService.update(id, data);
    }

    @Get()
    getAll(@Query('page') page: number) {
        return this.pageService.getAll(page);
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.pageService.get(id);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.pageService.delete(id);
    }
}
