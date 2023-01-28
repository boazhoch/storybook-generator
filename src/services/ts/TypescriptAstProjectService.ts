import { IComponentStoryFileFactory } from "./ComponentStoryFileFactory";
import { SourceFile } from "ts-morph";
import { ITSAstProjectLoader } from "./TSAstProjectLoader";

import "reflect-metadata";
import { inject, injectable } from "inversify";
import { StoriesInboundPortModel, StoryFileDto } from "../../usecases/types";

export interface IAstProjectService {
  loadAstFromConfig(config: StoriesInboundPortModel): IAstProjectService;
  createStories(): StoryFileDto[];
}

@injectable()
export class TypescriptAstProjectService implements IAstProjectService {
  private srcFiles?: SourceFile[];

  constructor(
    @inject("loader") private loader: ITSAstProjectLoader,
    @inject("componentFactory")
    private componentStoryFileFactory: IComponentStoryFileFactory
  ) {}

  loadAstFromConfig(config: StoriesInboundPortModel) {
    this.srcFiles = this.loader.loadAstFromConfig(config);

    return this;
  }

  createStories() {
    if (!this.srcFiles) {
      throw new Error(`Cannot create stories, didn't find any source files`);
    }
    return this.createStoryFormComponents(this.srcFiles);
  }

  private createStoryFormComponents(srcFiles: SourceFile[]) {
    return srcFiles
      .map((srcFile) => this.componentStoryFileFactory.create(srcFile))
      .flat()
      .filter(Boolean) as StoryFileDto[];
  }
}
