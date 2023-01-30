import { IComponentStoryFileFactory } from "../story-factory";
import { SourceFile } from "ts-morph";
import { ITSAstProjectLoader } from "../ast-loader";

import "reflect-metadata";
import { inject, injectable } from "inversify";
import { InputPortModel, StoryFileDto } from "../../app/types";
import { TYPES } from "../../types";

export interface IAstProjectService {
  loadAstFromConfig(config: InputPortModel): IAstProjectService;
  createStories(): StoryFileDto[];
}

@injectable()
export class TypescriptAstProjectService implements IAstProjectService {
  private srcFiles?: SourceFile[];

  constructor(
    @inject(TYPES.ITSAstProjectLoader) private loader: ITSAstProjectLoader,
    @inject(TYPES.IComponentStoryFileFactory)
    private componentStoryFileFactory: IComponentStoryFileFactory
  ) {}

  loadAstFromConfig(config: InputPortModel) {
    this.srcFiles = this.loader.getSourceFiles(config);

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
