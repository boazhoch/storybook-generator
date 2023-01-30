import { injectable, inject } from "inversify";
import { IAstProjectService } from "../services/ast";
import "reflect-metadata";

import {
  IStoriesUseCase,
  IPresenter,
  IRespositroy,
  InputPortModel,
  StoryFileDto,
} from "./types";
import { TYPES } from "../types";
import { DestinationStream, Logger, LoggerOptions } from "pino";

@injectable()
export class StoriesUseCase implements IStoriesUseCase {
  constructor(
    @inject(TYPES["IPresenter<StoriesResponseModel>"])
    private presnter: IPresenter<StoryFileDto>,
    @inject(TYPES.ILogger)
    private logger: Logger<LoggerOptions | DestinationStream>,
    @inject(TYPES.IAstProjectService) private ast: IAstProjectService,
    @inject(TYPES["IRespositroy<{ content: string; path: string }>"])
    private repo: IRespositroy<{ content: string; path: string }>
  ) {}
  async generateStoriesFromConfig(config: InputPortModel) {
    const storyFilesToGenerate = this.filterExistingStoryFiles(
      this.ast.loadAstFromConfig(config).createStories()
    );

    this.logger.info(
      `Number of stories to create: ${storyFilesToGenerate.length}`
    );

    if (!storyFilesToGenerate.length) {
      return this.presnter.abort("no stories to be created");
    }

    try {
      const stories = await this.generateStories(storyFilesToGenerate);
      this.presnter.presentAll(stories);
    } catch (e) {
      this.presnter.error(new Error("Couldn't generate files"));
    }
  }

  private filterExistingStoryFiles(stories: StoryFileDto[]) {
    this.logger.info("Filtering files that already exist");
    return stories.filter((storyFile) => {
      const isExist = this.repo.exist(storyFile.storyFilePath);
      if (isExist) {
        this.logger.info(
          `Filterting ${storyFile.name} file out since a story file already exist`
        );
      }
      return !isExist;
    });
  }

  private async generateStories(storyFiles: StoryFileDto[]) {
    const allStoriesResponseModel = storyFiles.map(async (storyFileDto) => {
      await this.repo.create({
        path: storyFileDto.storyFilePath,
        content: storyFileDto.template,
      });

      return storyFileDto;
    });

    return await Promise.all(allStoriesResponseModel);
  }
}
