import { ICliProgram } from "../program/index";

import { InputPortModel } from "../../../app/types";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../../types";
import { StoriesResponseModelWithTemplate } from "../../../services/story-template";
import path from "path";

export interface IStoriesBuilderAdapter {
  parse(): InputPortModel;
}

@injectable()
export class CliAdapter implements IStoriesBuilderAdapter {
  constructor(@inject(TYPES.ICliProgram) private cliProgram: ICliProgram) {}

  parse(): InputPortModel {
    const options = this.cliProgram.getOptions();

    return {
      componentsSrcFilePath: options.srcf || "",
      tsconfigFilePath: options.tsc || "",
      template: this.loadTemplate(options.t),
      excludedSrcFileGlob: options.ex,
    };
  }

  private loadTemplate(filePath?: string) {
    if (!filePath) {
      return;
    }

    const f = path.resolve(process.cwd(), filePath);
    return require(f) as (
      storyFileDto: StoriesResponseModelWithTemplate
    ) => string;
  }
}
