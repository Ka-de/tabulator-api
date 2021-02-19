import { Types } from "mongoose";

export function generateId(list: any[], item: string) {
    let id = new Types.ObjectId();
    while (
        list.find(l => l.id == id)
    ) {
        id = new Types.ObjectId();
    }

    return id;
}