export const TYPES = {
  ILogger: Symbol.for("ILogger"),
  ICliProgram: Symbol.for("ICliProgram"),
  IConfig: Symbol.for("IConfig"),
  "IPresenter<StoriesResponseModel>": Symbol.for(
    "IPresenter<StoriesResponseModel>"
  ),
  IStoriesBuilderAdapter: Symbol.for("IStoriesBuilderAdapter"),
  IAstProjectService: Symbol.for("IAstProjectService"),
  IStoryTemplateGenerator: Symbol.for("IStoryTemplateGenerator"),
  ITSAstProjectLoader: Symbol.for("ITSAstProjectLoader"),
  IComponentStoryFileFactory: Symbol.for("IComponentStoryFileFactory"),
  IStoriesUseCase: Symbol.for("IStoriesUseCase"),
  "IRespositroy<{ content: string; path: string }>": Symbol.for(
    "IRespositroy<{ content: string; path: string }>"
  ),
  IStoriesbBuilderController: Symbol.for("IStoriesbBuilderController"),
  CliGateway: Symbol.for("CliGateway"),
  Command: Symbol.for("Command"),
};
