import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PageDTO } from './dto/page.dto';
import { Page, PageDocument } from './schema/page.schema';

@Injectable()
export class PageService {
    constructor(
        @InjectModel(Page.name)
        private readonly pageModel: Model<PageDocument>
    ) { }

    async findById(id: Types.ObjectId) {
        const page = await this.pageModel.findOne({ _id: id });
        if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);

        return page;
    }

    async find() {
        const pages = await this.pageModel.find();
        return pages;
    }

    async create(data: PageDTO) {
        const model = new this.pageModel(data);
        const newPage = await model.save();

        return this.findById(newPage._id);
    }

    async update(id: Types.ObjectId, data: Partial<PageDTO>) {
        const page = await this.pageModel.findOneAndUpdate(
            { _id: id },
            { $set: data }
        );
        if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);

        return this.findById(id);
    }

    async delete(id: Types.ObjectId) {
        const page = await this.pageModel.findOneAndDelete({ _id: id });
        if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);

        return page;
    }
}
