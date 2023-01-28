import { injectable } from "inversify";

import { Project, SourceFile } from "ts-morph";

import "reflect-metadata";
import { StoriesInboundPortModel } from "../../usecases/types";

export interface ITSAstProjectLoader {
  loadAstFromConfig(config: StoriesInboundPortModel): SourceFile[];
}

@injectable()
export class TSAstProjectLoader implements ITSAstProjectLoader {
  constructor(
    private prj = new Project({
      skipFileDependencyResolution: true,
    })
  ) {}

  loadAstFromConfig(config: StoriesInboundPortModel) {
    console.debug("Adding tsconfig file to project");

    const components = this.prj.addSourceFilesAtPaths([
      config.componentsSrcFilePath,
      config.excludedSrcFileGlob ? `!${config.excludedSrcFileGlob}` : "",
    ]);

    console.debug("Adding source files to project");
    return components;
  }
}
