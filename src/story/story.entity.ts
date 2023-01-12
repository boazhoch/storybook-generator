import { injectable } from "inversify";
import { BaseEntity } from "../entities/Base";

export interface IStoryComponentEntity {
    fileName:string, 
     filePath: string, 
     componentName: string
}

@injectable()
export class StoryComponentEntity extends BaseEntity {
    
    constructor(public fileName:string, public filePath: string, public componentName: string) {
        super();
    }
}