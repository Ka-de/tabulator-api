import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageDTO, PageModel, PageRO } from './page.model';

@Injectable()
export class PageService {
    constructor(
        @InjectModel('Page') private readonly pageModel: Model<PageModel>
    ) { }

    async create(data: PageDTO) {
        const page = await this.pageModel.create(data);
        const saved = await page.save();

        return new PageRO(saved);
    }

    async update(id: string, data: Partial<PageDTO>) {
        const page = await this.pageModel.findById(id);
        if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);

        await this.pageModel.findOneAndUpdate({ _id: id }, data);
        return this.get(id);
    }

    async get(id: string) {
        const page = await this.pageModel.findById(id);
        if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);

        return new PageRO(page);
    }

    async getAll(page: number) {
        let sort = page ? [
            { $skip: 20 * (page - 1) },
            { $limit: 20 },
        ] : [];

        const found = await this.pageModel.aggregate([
            { $project: { __v: 0 } },
            ...sort
        ]);

        return found.map(p => new PageRO(p as PageDTO));
    }

    async delete(id: string) {
        const page = await this.pageModel.findById(id);
        if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);

        await this.pageModel.findOneAndDelete({ _id: id });
        return new PageRO(page);
    }
}
