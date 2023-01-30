import { IPresenter, OutputPortModel } from "../app/types";
import { inject, injectable } from "inversify";

import "reflect-metadata";
import { Logger, LoggerOptions, DestinationStream } from "pino";
import { TYPES } from "../types";

@injectable()
export class StoriesPresenter implements IPresenter<OutputPortModel> {
  constructor(
    @inject(TYPES.ILogger)
    private logger: Logger<LoggerOptions | DestinationStream>
  ) {}
  presentAll(models: OutputPortModel[]) {
    const filesCreated = models.map((storyFile) => ({
      fileName: storyFile.name,
      path: storyFile.srcFilePath,
    }));

    this.logger.info(filesCreated);
  }

  abort(msg?: string): void {
    if (msg) {
      this.logger.warn(`Aborting due to ${msg}`);
      return;
    }
    this.logger.warn(`Aborting`);
  }

  error(err: Error) {
    this.logger.error(err.message);
    throw err;
  }
}
