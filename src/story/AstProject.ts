import fs from 'fs';
import { StoriesBuildConfiguration } from "./storiesBuildConfig.dto";
import { Project, ExportedDeclarations, SourceFile, Node, ImportEqualsDeclaration } from "ts-morph";
import { v4 } from "uuid";
import { Writer } from './Writer';
import { StoryTemplateGenerator } from './StoryTemplateGenerator';

const defaultRootSrc = process.env.STORM_DIR;

export interface AstProject {
  loadAstFromConfig(config: StoriesBuildConfiguration): AstProject
  createStories(): void;
}

export interface StoryFileTemplateModel {
  name: string;
  srcFilePath: string;
  importStr: string;
  isDefualtExport: boolean;
}

export class TypescriptAstProject implements AstProject {
  private srcFiles?: SourceFile[];
  
  constructor(private writer: Writer, private tempalteFileGenerator: StoryTemplateGenerator, private prj = new Project()) {
  }

  loadAstFromConfig(config: StoriesBuildConfiguration) {
    this.prj.addSourceFilesFromTsConfig(config.tsconfigFilePath);
    this.setSoruceFiles(config.componentsSrcFilePath, config.excludedSrcFileGlob);

    return this;
  }

  createStories() {
    if (!this.srcFiles) {
      return Promise.reject(new Error(`Cannot create stories, didn't find any source files`));
    }
    return this.createStoryFormComponents(this.srcFiles).then(values => {
      values
    });
  }

  private setSoruceFiles(include:string, exclude:string = "") {
    this.srcFiles = this.prj.getSourceFiles([include, exclude]);
  }

  private isMultipleExports(
    exports: ReadonlyMap<string, ExportedDeclarations[]>
  ) {
    return exports.size > 1;
  }

  private extractDefaultExportVarDecleration(
    exports: ReadonlyMap<string, ExportedDeclarations[]>
  ) {
    const namedDefaultExport = 'default';

    const defaultExport = exports.get(namedDefaultExport);
    const [decleration] = defaultExport || [];

    return decleration;
  }

  private createStoryComponent(
    srcFile: SourceFile,
    handleMultipleDeclarations: (
      exports: ReadonlyMap<string, ExportedDeclarations[]>
    ) => ExportedDeclarations
  ) {
    const exports = srcFile.getExportedDeclarations();

    let decleration: undefined | ExportedDeclarations = undefined;

    if (exports.size === 0) {
      console.warn(
        `File has no exported declarations, file name is: ${srcFile.getBaseName()}`
      );
      return;
    }

    if (this.isMultipleExports(exports)) {
      decleration = handleMultipleDeclarations(exports);
    } else {
      decleration = exports.values().next().value[0];
    }

    if (!Node.isVariableDeclaration(decleration)) {
      return;
    }

    const componentModel = this.createComponentModel(
      srcFile.getBaseName(),
      srcFile.getFilePath(),
      decleration.getName(),
      Boolean(srcFile.getDefaultExportSymbol())
    );

    return this.writer.checkFileExists(
      this.componentStoryFilePath(componentModel.srcFilePath)
    ).then(() => {
      return this.writer.write(componentModel.srcFilePath, this.tempalteFileGenerator.generate(componentModel)).then((isExist) => ({ isCreated: true, componentModel, storyPath: componentModel.srcFilePath }))
    })
  }

  private createComponentModel(
    name: string,
    srcFilePath: string,
    importStr: string,
    isDefualtExport: boolean
  ): StoryFileTemplateModel {
    return { name, srcFilePath, importStr, isDefualtExport };
  }

  private componentStoryFilePath = (path: string) =>
    `${path.replace('.tsx', '.stories.tsx')}`;

  private createStoryFormComponents(srcFiles: SourceFile[]) {
    return Promise.all(
      srcFiles
        .map(s => this.createStoryComponent(s, this.extractDefaultExportVarDecleration))
        .filter(Boolean)
    );
  }
}
