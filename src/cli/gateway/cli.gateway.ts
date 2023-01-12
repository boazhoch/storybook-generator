import { TypescriptAstProject } from './../../story/AstProject';

import { StoriesbuilderController, StoryController } from "../../story/story.controller";
import { StoriesUseCase } from "../../story/story.usecase";
import { CliAdapter } from "../adapter";
import { FSWriter } from '../../story/Writer';


export class CliGateway {
    controller: StoriesbuilderController;
    constructor() {
        this.controller = new StoryController(new CliAdapter(), new StoriesUseCase(new StoriesBuilderPreseter(), new TypescriptAstProject(new FSWriter())));
    }
    run() {
        this.controller.run();
    }
}