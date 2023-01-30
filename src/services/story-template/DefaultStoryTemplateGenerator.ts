import { StoriesResponseModelWithTemplate } from "./index";

class DefaultStoryTemplateGenerator {
  public generate = (storyFileDto: StoriesResponseModelWithTemplate) => {
    return this.defaultTemplateGenerator(storyFileDto);
  };

  private defaultTemplateGenerator(
    storyFileDto: StoriesResponseModelWithTemplate
  ) {
    return `${this.constructImportStatementForAll(storyFileDto)}
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  component: ${this.getComponentStory(storyFileDto)},
  ${this.additionalStoryProperties(storyFileDto)}
}
${this.constructExportStatement(storyFileDto).join(";\n")}`;
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

    const exports = storyFileDto.exportStatements
      .slice()
      .splice(startNumber, 1);

    return `subcomponents: { ${exports
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
    const defaultImport = this.constructDefaultImportStatement(
      StoryFileDto.exportStatements
    );

    return `import ${
      defaultImport ? defaultImport + "," : ""
    } {${this.constructImportStatement(
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

export { DefaultStoryTemplateGenerator };
