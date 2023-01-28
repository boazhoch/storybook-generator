import { IPresenter, StoriesResponseModel } from "./../usecases/types";
import { injectable } from "inversify";

import "reflect-metadata";

@injectable()
export class StoriesBuilderPresenter
  implements IPresenter<StoriesResponseModel>
{
  presentAll(models: StoriesResponseModel[]) {
    const filesCreated = models.map((storyFile) => ({
      fileName: storyFile.name,
      path: storyFile.srcFilePath,
    }));

    console.log(filesCreated);
  }

  abort(msg?: string): void {
    if (msg) {
      console.log(`Aborting due to ${msg}`);
      return;
    }
    console.log(`Aborting`);
  }

  error(err: Error) {
    console.error(err.message);
    throw err;
  }
}
