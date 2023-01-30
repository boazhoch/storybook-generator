import { IStoriesUseCase, InputPortModel } from "../app/types";

import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IStoriesBuilderAdapter } from "../frameworks-drivers/cli/adapter";
import { TYPES } from "../types";

export interface IStoriesController {
  run(): void;
  parse(): IStoriesController;
}

@injectable()
export class StoriesController implements IStoriesController {
  private buildConfig?: InputPortModel;

  constructor(
    @inject(TYPES.IStoriesBuilderAdapter)
    private adapter: IStoriesBuilderAdapter,
    @inject(TYPES.IStoriesUseCase) private useCase: IStoriesUseCase
  ) {}

  run() {
    if (!this.buildConfig) {
      return;
    }
    this.useCase.generateStoriesFromConfig(this.buildConfig);
  }

  parse() {
    this.buildConfig = this.adapter.parse();

    return this;
  }
}
