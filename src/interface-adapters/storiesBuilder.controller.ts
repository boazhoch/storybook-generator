import { IStoriesBuilderAdapter } from "../usecases/storiesBuilderAdapter";
import {
  StoriesBuilderUseCase,
  StoriesConfigRequestModel,
} from "../usecases/stories.usecase";
import { inject, injectable } from "inversify";
import "reflect-metadata";

export interface IStoriesbBuilderController {
  run(): void;
  parseConfig(): IStoriesbBuilderController;
}

@injectable()
export class StoriesBuilderController implements IStoriesbBuilderController {
  private buildConfig?: StoriesConfigRequestModel;

  constructor(
    @inject("adapter") private adapter: IStoriesBuilderAdapter,
    @inject("StoriesBuilderUseCase") private useCase: StoriesBuilderUseCase
  ) {}

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
