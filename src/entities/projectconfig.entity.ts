import { injectable } from "inversify";
import { BaseEntity } from "./base.entity";

export interface IProjectConfig {
    fileName:string,  
    srcFilePath: string, 
    componentName: string
    importStr?: string;
    isDefaultExport?: boolean;
}

export class ProjectConfigEntity extends BaseEntity implements IProjectConfig {
    constructor(
        public fileName:string, 
        public srcFilePath:string, 
        public componentName:string,
        public importStr:string,
        public isDefaultExport?: boolean) {
        super();
    }
}