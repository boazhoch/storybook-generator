


import { IStoriesBuilderAdapter } from "../usecases/storiesBuilderAdapter";
import { StoriesBuilderUseCase, StoriesConfigRequestModel } from "../usecases/stories.usecase";

export interface IStoriesbBuilderController {
    run(): void;
    parseConfig(): IStoriesbBuilderController;
}

export class StoriesBuilderController implements IStoriesbBuilderController {
    private buildConfig?: StoriesConfigRequestModel;
    
    constructor(private adapter: IStoriesBuilderAdapter, private useCase: StoriesBuilderUseCase) {
    }

    run() {
        if (!this.buildConfig) {
            return;
        }
        this.useCase.generateStoriesFromConfig(this.buildConfig);
    }

    parseConfig() {
        this.buildConfig = this.adapter.parse();

        return this;
    }
}