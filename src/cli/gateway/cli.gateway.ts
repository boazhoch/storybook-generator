import { StoriesBuilderController } from "../../interface-adapters/storiesBuilder.controller";
import { StoriesUseCase } from "../../usecases/stories.usecase";
import { CliAdapter, IPresenter, StoriesResponseModel } from "../adapter";
import { FileSystemRepo } from "../../frameworks-drivers/file-system/FileSystemRepo";
import { TypescriptAstProjectService } from "../../services/ts/TypescriptAstProjectService";
import { TSAstProjectLoader } from "../../services/ts/TSAstProjectLoader";
import { StoryTemplate } from "../../services/storyTemplateGenerator";
import { StoriesBuilderPresenter } from "../../interface-adapters/stories.presenter";
import "reflect-metadata";

import { Container } from "inversify";
import { ComponentStoryFileFactory } from "../../services/ts/ComponentStoryFileFactory";

export class CliGateway {
  controller: StoriesBuilderController;
  constructor() {
    const container = new Container({ autoBindInjectable: true });
    container
      .bind<IPresenter<StoriesResponseModel>>(
        "IPresenter<StoriesResponseModel>"
      )
      .to(StoriesBuilderPresenter);
    container.bind("adapter").to(CliAdapter);
    container.bind("IAstProjectService").to(TypescriptAstProjectService);
    container.bind("tempalteFileGenerator").to(StoryTemplate);
    container.bind("loader").to(TSAstProjectLoader);
    container.bind("componentFactory").to(ComponentStoryFileFactory);
    container.bind("StoriesUseCase").to(StoriesUseCase);
    container.bind("presnter").to(StoriesBuilderPresenter);
    container
      .bind("IRespositroy<{ content: string; path: string }>")
      .to(FileSystemRepo);
    container.bind("StoriesBuilderUseCase").to(StoriesUseCase);

    this.controller = container.resolve(StoriesBuilderController);
  }
  run() {
    this.controller.parse();
    this.controller.run();
  }
}
