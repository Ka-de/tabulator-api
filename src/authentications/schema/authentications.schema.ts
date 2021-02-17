import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Authentication {
    @Prop()
    email: string;

    @Prop()
    publickey: string;

    @Prop()
    privatekey: string;

    @Prop({ default: [] })
    access: string[];
}

export type AuthenticationDocument = Authentication & Document;

export const AuthenticationSchema = SchemaFactory.createForClass(Authentication);