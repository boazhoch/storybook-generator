import { injectable } from "inversify";

import { Project, SourceFile } from "ts-morph";
import { StoriesConfigRequestModel } from "../../usecases/stories.usecase";
import "reflect-metadata";

export interface ITSAstProjectLoader {
  loadAstFromConfig(config: StoriesConfigRequestModel): SourceFile[];
}

@injectable()
export class TSAstProjectLoader implements ITSAstProjectLoader {
  constructor(private prj = new Project()) {}

  loadAstFromConfig(config: StoriesConfigRequestModel) {
    console.debug("Adding tsconfig file to project");
    this.prj.addSourceFilesFromTsConfig(config.tsconfigFilePath);

    console.debug("Adding source files to project");
    return this.prj.getSourceFiles([
      config.componentsSrcFilePath,
      config.excludedSrcFileGlob || "",
    ]);
  }
}
