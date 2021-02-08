import { Document, Schema, Types } from "mongoose";

export interface PageDTO {
    url: string;
    created: Date;
    updated: Date;
    components: any;
    details: any;
}

export interface PageModel extends PageDTO, Document { }

export const PageEntity = {
    name: 'Page',
    schema: new Schema({
        url: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now()
        },
        updated: {
            type: Date
        },
        components: {
            type: {},
            default: {}
        },
        details: {
            type: {},
            default: {}
        }
    })
}

export class PageRO {
    url: string;
    created: Date;
    updated: Date;
    components: any;
    details: any;
    id: string;

    constructor(page: PageDTO) {
        this.url = page.url;
        this.created = page.created;
        this.updated = page.updated;
        this.components = page.components;
        this.details = page.details;
        this.id = page['_id'];
    }
}