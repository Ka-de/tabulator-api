import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as jwt from 'jsonwebtoken';

import { AuthenticationDTO } from 'src/authentications/dto/authentications.dto';
import { Authentication } from 'src/authentications/schema/authentications.schema';
import { AuthenticationDocument } from './schema/authentications.schema';

@Injectable()
export class AuthenticationsService {
    constructor(
        @InjectModel(Authentication.name)
        private readonly authenticationModel: Model<AuthenticationDocument>
    ) { }

    async find() {
        const authentications = await this.authenticationModel.find();

        return authentications.map(auth => {
            auth.privatekey = undefined;
            return auth;
        });
    }

    async findById(_id: Types.ObjectId) {
        const authentication = await this.authenticationModel.findOne({ _id });
        authentication.privatekey = undefined;

        return authentication;
    }

    async findByPublicKey(publickey: string) {
        const authentication = await this.authenticationModel.findOne({ publickey });
        authentication.privatekey = undefined;

        return authentication;
    }

    async create(data: AuthenticationDTO) {
        const authenticaion = await this.authenticationModel.findOne({ email: data.email });
        if (authenticaion) return this.findById(authenticaion._id);

        const model = new this.authenticationModel(data);

        model.privatekey = jwt.sign({
            _id: model._id,
            email: model.email
        }, process.env.SECRET);
        
        model.privatekey = jwt.sign(model.publickey, process.env.SECRET);

        const newAuthentication = await model.save();
        return this.findById(newAuthentication._id);
    }
}
