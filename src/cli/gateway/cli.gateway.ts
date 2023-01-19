import { StoriesBuilderController } from "../../interface-adapters/storiesBuilder.controller";
import { StoriesUseCase } from "../../usecases/stories.usecase";
import { CliAdapter } from "../adapter";
import { FileSystemRepo } from "../../frameworks-drivers/file-system/FileSystemRepo";
import { TypescriptAstProjectService } from "../../services/ts";
import { TSAstProjectLoader } from "../../services/ts/ITSAstPrjectLoader";
import { ComponentStoryFileFactory } from "../../services/ts/IComponentStoryFileFactory";
import { StoryTemplate } from "../../services/storyTemplateGenerator";
import { StoriesBuilderPresenter } from "../../interface-adapters/stories.presenter";
import "reflect-metadata";

import { Container } from "inversify";

export class CliGateway {
  controller: StoriesBuilderController;
  constructor() {
    const container = new Container();
    container.bind("adapter").to(CliAdapter);
    container.bind("ast").to(TypescriptAstProjectService);
    container.bind("tempalteFileGenerator").to(StoryTemplate);
    container.bind("loader").to(TSAstProjectLoader);
    container.bind("componentFactory").to(ComponentStoryFileFactory);
    container.bind("StoriesUseCase").to(StoriesUseCase);
    container.bind("presnter").to(StoriesBuilderPresenter);
    container.bind("repo").to(FileSystemRepo);
    container.bind("StoriesBuilderUseCase").to(StoriesUseCase);

    this.controller = container.resolve(StoriesBuilderController);
    console.log(this.controller);
  }
  run() {
    this.controller.parseConfig();
    this.controller.run();
  }
}
