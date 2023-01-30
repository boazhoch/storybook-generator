import { inject, injectable, optional } from "inversify";

import "reflect-metadata";
import { OutputPortModel } from "../../app/types";

export interface StoriesResponseModelWithTemplate
  extends Omit<OutputPortModel, "template"> {}

export interface IStoryTemplateGenerator {
  generate(storyFileDto: StoriesResponseModelWithTemplate): string;
}

@injectable()
export class StoryTemplate implements IStoryTemplateGenerator {
  /**
   *
   */
  constructor(
    @inject("template")
    private templatebuilder: (
      storyFileDto: StoriesResponseModelWithTemplate
    ) => string
  ) {}

  public generate(storyFileDto: StoriesResponseModelWithTemplate) {
    const template = this.templatebuilder(storyFileDto);

    if (typeof template !== "string") {
      throw new TypeError(
        `Generated template is not a string, instead got: ${typeof template}`
      );
    }

    return template;
  }
}
