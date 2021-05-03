import { v4 as uuidv4 } from 'uuid';

export class RowDTO {
    r_id: string;
    constructor(
        data: RowDTO | Partial<RowDTO>
    ) {
        Object.keys(data).map(k => {
            this[k] = data[k];
        });
        
        this.r_id = this.r_id || uuidv4();//set the ID
    }
}