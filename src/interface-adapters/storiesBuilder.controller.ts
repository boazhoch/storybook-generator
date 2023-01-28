import { IStoriesUseCase, StoriesInboundPortModel } from "../usecases/types";

import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IStoriesBuilderAdapter } from "../cli/adapter";

export interface IStoriesbBuilderController {
  run(): void;
  parse(): IStoriesbBuilderController;
}

@injectable()
export class StoriesBuilderController implements IStoriesbBuilderController {
  private buildConfig?: StoriesInboundPortModel;

  constructor(
    @inject("adapter") private adapter: IStoriesBuilderAdapter,
    @inject("StoriesBuilderUseCase") private useCase: IStoriesUseCase
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
