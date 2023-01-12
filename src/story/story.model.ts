import { IStoryComponentEntity } from './story.entity';
class StoryComponentModel {
    constructor(private entity: IStoryComponentEntity) {
        this.entity = entity;
    }

    getFilePath(): string {
        return this.entity.filePath;
    }

    getFileName(): string {
        return this.entity.fileName;
    }

    getComponentName(): string {
        return this.entity.componentName;
    }
}