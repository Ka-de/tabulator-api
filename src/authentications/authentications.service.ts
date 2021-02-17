import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { AuthenticationDTO } from 'src/authentications/dto/authentications.dto';
import { Authentication } from 'src/authentications/schema/authentications.schema';
import { AuthenticationDocument } from './schema/authentications.schema';

@Injectable()
export class AuthenticationsService {
    constructor(
        @InjectModel(Authentication.name)
        private readonly authenticationModel: Model<AuthenticationDocument>
    ) { }

    async create(data: AuthenticationDTO) {
        const authenticaion = await this.authenticationModel.findOne({ email: data.email });
        if (authenticaion) return this.findById(authenticaion._id);

        const model = new this.authenticationModel(data);
        model.publickey = `${model._id}${uuidv4().split('-').join('')}`;
        model.privatekey = `${model._id}${uuidv4().split('-').join('')}`;

        const newAuthentication = await model.save();
        return this.findById(newAuthentication._id);
    }

    async findById(_id: Types.ObjectId) {
        const authentication = await this.authenticationModel.findOne({ _id });
        authentication.privatekey = undefined;

        return authentication;
    }
}
