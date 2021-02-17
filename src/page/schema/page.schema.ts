import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Page {
    @Prop()
    url: string;

    @Prop({ type: {} })
    components: any;

    @Prop({ type: {} })
    details: any;
}

export type PageDocument = Page & Document;
export const PageSchema = SchemaFactory.createForClass(Page);