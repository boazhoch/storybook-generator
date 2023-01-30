import { CliGateway } from "../interface-adapters/cli.gateway";
import { CliProgram } from "../frameworks-drivers/cli/program/index";
import { program } from "commander";
import { Container } from "inversify";
import {
  CliAdapter,
  IStoriesBuilderAdapter,
} from "../frameworks-drivers/cli/adapter";
import { Config, IConfig } from "../frameworks-drivers/cli/config/cli.config";
import { FileSystemRepo } from "../frameworks-drivers/file-system";
import { StoriesPresenter } from "../interface-adapters/stories.presenter";

import {
  IStoryTemplateGenerator,
  StoryTemplate,
} from "../services/story-template";
import {
  ComponentStoryFileFactory,
  IComponentStoryFileFactory,
} from "../services/story-factory";
import {
  ITSAstProjectLoader,
  TSAstProjectLoader,
} from "../services/ast-loader";
import {
  IAstProjectService,
  TypescriptAstProjectService,
} from "../services/ast";
import { StoriesUseCase } from "../app/stories.usecase";
import {
  IPresenter,
  IRespositroy,
  IStoriesUseCase,
  OutputPortModel,
} from "../app/types";
import { TYPES } from "../types";
import {
  IStoriesController,
  StoriesController,
} from "../interface-adapters/stories.controller";
import pino from "pino";
import { DefaultStoryTemplateGenerator } from "../services/story-template/DefaultStoryTemplateGenerator";

export { init };

/**
 * Init application, register DI services, and run the application calling CliGateway.run()
 */
const init = () => {
  const container = registerServices(
    new Container({ autoBindInjectable: true, defaultScope: "Singleton" })
  );

  const cli = container.get(CliGateway);

  cli.run();
};

const registerServices = (container: Container) => {
  container.bind(TYPES.ILogger).toConstantValue(pino());
  container.bind(TYPES.ICliProgram).to(CliProgram);
  container.bind(TYPES.Command).toConstantValue(program);
  container.bind<IConfig>(TYPES["IConfig"]).to(Config);
  container
    .bind<IPresenter<OutputPortModel>>(
      TYPES["IPresenter<StoriesResponseModel>"]
    )
    .to(StoriesPresenter);
  container
    .bind<IStoriesBuilderAdapter>(TYPES["IStoriesBuilderAdapter"])
    .to(CliAdapter);
  container
    .bind<IAstProjectService>(TYPES["IAstProjectService"])
    .to(TypescriptAstProjectService);
  container
    .bind<IStoryTemplateGenerator>(TYPES["IStoryTemplateGenerator"])
    .toDynamicValue((ctx) => {
      const templateBuilder =
        ctx.container.get(CliAdapter).parse().template ||
        new DefaultStoryTemplateGenerator().generate;

      return new StoryTemplate(templateBuilder);
    });
  container
    .bind<ITSAstProjectLoader>(TYPES["ITSAstProjectLoader"])
    .to(TSAstProjectLoader);
  container
    .bind<IComponentStoryFileFactory>(TYPES["IComponentStoryFileFactory"])
    .to(ComponentStoryFileFactory);
  container
    .bind<IRespositroy<{ content: string; path: string }>>(
      TYPES["IRespositroy<{ content: string; path: string }>"]
    )
    .to(FileSystemRepo);
  container.bind<IStoriesUseCase>(TYPES["IStoriesUseCase"]).to(StoriesUseCase);
  container
    .bind<IStoriesController>(TYPES["IStoriesbBuilderController"])
    .to(StoriesController);
  container.bind<CliGateway>(TYPES["CliGateway"]).to(CliGateway);

  return container;
};
