import { StoryController } from "../../story/story.controller";
import { StoriesUseCase } from "../../story/story.usecase";
import { WebAdapter } from "../adapter";

export class WebGateway {
    
    run(req: {body: any}) {
        new StoryController(new WebAdapter(req), new StoriesUseCase(new StoriesBuilderPreseter())).run()
    }
}