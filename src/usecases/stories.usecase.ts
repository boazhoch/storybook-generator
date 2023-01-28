import { injectable, inject } from "inversify";
import { IAstProjectService } from "../services/ts/TypescriptAstProjectService";
import "reflect-metadata";

import {
  IStoriesUseCase,
  IPresenter,
  IRespositroy,
  StoriesInboundPortModel,
  StoryFileDto,
} from "./types";

@injectable()
export class StoriesUseCase implements IStoriesUseCase {
  constructor(
    @inject("IPresenter<StoriesResponseModel>")
    private presnter: IPresenter<StoryFileDto>,
    @inject("IAstProjectService") private ast: IAstProjectService,
    @inject("IRespositroy<{ content: string; path: string }>")
    private repo: IRespositroy<{ content: string; path: string }>
  ) {}
  async generateStoriesFromConfig(config: StoriesInboundPortModel) {
    const storyFilesToGenerate = this.filterExistingStoryFiles(
      this.ast.loadAstFromConfig(config).createStories()
    );

    console.log(`Number of stories to create: ${storyFilesToGenerate.length}`);

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
    console.log("Filtering files that already exist");
    return stories.filter((storyFile) => {
      const isExist = this.repo.exist(storyFile.storyFilePath);
      if (isExist) {
        console.log(
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
