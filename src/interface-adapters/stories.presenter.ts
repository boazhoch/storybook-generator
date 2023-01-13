import { StoryFileDto } from './../services/ts/IComponentStoryFileFactory';
import { StoriesReponsePresenter } from "../usecases/stories.usecase";
export class StoriesBuilderPresenter implements StoriesReponsePresenter {
    presentAll(models: StoryFileDto[]) {
        const filesCreated = models.map((storyFile) => ({ fileName: storyFile.name, path: storyFile.srcFilePath }));

        console.log(filesCreated);
    }

    abort(msg?: string): void {
        if(msg) {
            console.log(`Aborting due to ${msg}`);
            return;
        }
        console.log(`Aborting`);
    }
}