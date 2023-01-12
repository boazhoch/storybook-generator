import { injectable } from 'inversify';
import { v4 } from 'uuid';


export class BaseEntity {
    public id: string;
    constructor() {
        this.id = v4();
    }
}