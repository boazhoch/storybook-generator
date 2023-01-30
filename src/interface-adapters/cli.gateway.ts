import "reflect-metadata";

import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IStoriesController } from "./stories.controller";

@injectable()
export class CliGateway {
  constructor(
    @inject(TYPES.IStoriesbBuilderController)
    private controller: IStoriesController
  ) {}
  run() {
    this.controller.parse();
    this.controller.run();
  }
}
