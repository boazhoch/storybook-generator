
import { StoriesBuilderController } from "../../interface-adapters/storiesBuilder.controller";
import { StoriesUseCase } from "../../usecases/stories.usecase";
import { CliAdapter } from "../adapter";
import { FileSystemRepo } from '../../frameworks-drivers/file-system/FileSystemRepo';
import { TypescriptAstProjectService } from "../../services/ts";
import { TSAstProjectLoader } from "../../services/ts/ITSAstPrjectLoader";
import { ComponentStoryFileFactory } from "../../services/ts/IComponentStoryFileFactory";
import { StoryTemplate } from "../../services/storyTemplateGenerator";
import { StoriesBuilderPresenter } from "../../interface-adapters/stories.presenter";


export class CliGateway {
    controller: StoriesBuilderController;
    constructor() {
        const cliApdater = new CliAdapter();
        const ast = new TypescriptAstProjectService(new TSAstProjectLoader(), new ComponentStoryFileFactory(new StoryTemplate()));
        const useCause = new StoriesUseCase(new StoriesBuilderPresenter(), ast, new FileSystemRepo());

        this.controller = new StoriesBuilderController(cliApdater, useCause);
    }
    run() {
        this.controller.parseConfig();
        this.controller.run();
    }
}