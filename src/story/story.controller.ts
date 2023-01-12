

import { StoriesBuilderAdapter } from "./interface";
import { StoriesBuilderUseCase } from "./story.usecase";

export interface StoriesbuilderController {
    run(): void;
}

export class StoryController implements StoriesbuilderController {
    
    constructor(private adapter: StoriesBuilderAdapter, private useCase: StoriesBuilderUseCase) {
    }

    run() {
        const buildConfig = this.adapter.parse();
        this.useCase.generateStoriesFromConfig(buildConfig);
    }
}