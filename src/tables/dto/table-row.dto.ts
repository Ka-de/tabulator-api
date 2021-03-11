import { v4 as uuidv4 } from 'uuid';

export class TableRowDTO {
    r_id: string;
    constructor(
        data: TableRowDTO | Partial<TableRowDTO>
    ) {
        Object.keys(data).map(k => {
            this[k] = data[k];
        });
        
        this.r_id = this.r_id || uuidv4();//set the ID
    }
}