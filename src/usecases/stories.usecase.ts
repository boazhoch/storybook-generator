import { injectable, inject } from "inversify";
import { StoryFileDto } from "./../services/ts/IComponentStoryFileFactory";
import { IAstProjectService } from "../services/ts";
import "reflect-metadata";

export interface StoriesBuilderUseCase {
  generateStoriesFromConfig(config: StoriesConfigRequestModel): void;
}

export interface StoriesConfigRequestModel {
  tsconfigFilePath: string;
  componentsSrcFilePath: string;
  excludedSrcFileGlob?: string;
  template: string;
}

export interface StoriesResponseModel {
  name: string;
  srcFilePath: string;
  exportStatementName: string;
  template: string;
  isDefaultExport: boolean;
  storyFilePath: string;
}

export interface IRespositroy<T> {
  create(model: T): Promise<T>;
  exist(path: string): boolean;
}

export interface StoriesReponsePresenter<T extends StoryFileDto = StoryFileDto>
  extends IPresenter<T> {}

interface IPresenter<T> {
  presentAll(param: T[]): void;
  abort(msg?: string): void;
}

@injectable()
export class StoriesUseCase<T extends { content: string; path: string }>
  implements StoriesBuilderUseCase {
  constructor(
    @inject("presnter") private presnter: StoriesReponsePresenter,
    @inject("ast") private ast: IAstProjectService,
    @inject("repo") private repo: IRespositroy<T>
  ) {}
  async generateStoriesFromConfig(config: StoriesConfigRequestModel) {
    const storiesFiles = this.ast
      .loadAstFromConfig(config)
      .createStories()
      .filter(storyFileConfig => {
        console.log("Filtering files that already exist");
        return !this.repo.exist(storyFileConfig.storyFilePath);
      });

    console.log(`Number of stories to create: ${storiesFiles.length}`);

    if (!storiesFiles.length) {
      return this.presnter.abort("no stories to be created");
    }

    const allStoriesResponseModel = storiesFiles.map(async storyFileDto => {
      await this.repo.create({
        path: storyFileDto.storyFilePath,
        content: storyFileDto.template,
      } as T);

      return storyFileDto;
    });

    const allFileModels = await Promise.all(allStoriesResponseModel);

    this.presnter.presentAll(allFileModels);
  }
}
