import { inject, injectable, optional } from "inversify";

import "reflect-metadata";
import { StoriesResponseModel } from "../usecases/types";

interface StoriesResponseModelWithTemplate
  extends Omit<StoriesResponseModel, "template"> {}

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
    @optional()
    private templatebuilder?: (
      storyFileDto: StoriesResponseModelWithTemplate
    ) => string
  ) {}

  public generate(storyFileDto: StoriesResponseModelWithTemplate) {
    return (
      this.templatebuilder?.(storyFileDto) ||
      ` 
      ${this.constructImportStatementForAll(storyFileDto)}

      export default {
      /* 👇 The title prop is optional.
      * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
      * to learn how to generate automatic titles
      */
      component: ${this.getComponentStory(storyFileDto)},
      ${this.additionalStoryProperties(storyFileDto)}
      }

      ${this.constructExportStatement(storyFileDto).join(";")}
    `
    );
  }
  private additionalStoryProperties(
    storyFileDto: StoriesResponseModelWithTemplate
  ) {
    if (storyFileDto.exportStatements.length <= 1) {
      return "";
    }

    const defaultIndex = storyFileDto.exportStatements.findIndex(
      (e) => e.isDefault
    );

    const startNumber = defaultIndex !== -1 ? defaultIndex : 1;

    storyFileDto.exportStatements.splice(startNumber, 1);

    return `subcomponents: { ${storyFileDto.exportStatements
      .map((ex) => ex.exportStatement)
      .join(",")} }`;
  }

  private getComponentStory(storyFileDto: StoriesResponseModelWithTemplate) {
    const defaultOrFirstExport =
      storyFileDto.exportStatements.find((e) => e.isDefault) ||
      storyFileDto.exportStatements[0];

    return defaultOrFirstExport.exportStatement;
  }

  private constructImportStatementForAll(
    StoryFileDto: StoriesResponseModelWithTemplate
  ) {
    return `import ${this.constructDefaultImportStatement(
      StoryFileDto.exportStatements
    )}, {${this.constructImportStatement(
      StoryFileDto.exportStatements
    )}} from "./${StoryFileDto.name.replace(".tsx", "")}"`;
  }

  private constructDefaultImportStatement(
    exports: StoriesResponseModelWithTemplate["exportStatements"]
  ) {
    return (exports.find((e) => e.isDefault) || { exportStatement: "" })
      .exportStatement;
  }

  private constructImportStatement(
    exports: StoriesResponseModelWithTemplate["exportStatements"]
  ) {
    return exports
      .filter((e) => !e.isDefault)
      .map((ex) => ex.exportStatement)
      .join(",");
  }

  private constructExportStatement(
    storyFileDto: StoriesResponseModelWithTemplate
  ) {
    return storyFileDto.exportStatements.map(
      (ex) =>
        `export const Story${ex.exportStatement} = () => <${ex.exportStatement} />`
    );
  }
}
