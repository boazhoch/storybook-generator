import { IComponentStoryFileFactory, StoryFileDto } from './IComponentStoryFileFactory';
import { SourceFile, } from "ts-morph";
import { ITSAstProjectLoader } from './ITSAstPrjectLoader';
import { StoriesConfigRequestModel } from '../../usecases/stories.usecase';

export interface IAstProjectService {
  loadAstFromConfig(config: StoriesConfigRequestModel): IAstProjectService
  createStories(): StoryFileDto[];
}

export class TypescriptAstProjectService implements IAstProjectService {
  private srcFiles?: SourceFile[];
  
  constructor(private loader: ITSAstProjectLoader, private componentStoryFileFactory: IComponentStoryFileFactory) {
  }

  loadAstFromConfig(config: StoriesConfigRequestModel) {
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
    return srcFiles.map((srcFile) => this.componentStoryFileFactory.create(srcFile)).filter(Boolean) as StoryFileDto[];
  }
}


