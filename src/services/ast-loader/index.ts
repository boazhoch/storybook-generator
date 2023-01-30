import { inject, injectable } from "inversify";

import { Project, SourceFile } from "ts-morph";

import "reflect-metadata";
import { InputPortModel } from "../../app/types";
import { Logger, LoggerOptions, DestinationStream } from "pino";
import { TYPES } from "../../types";

export interface ITSAstProjectLoader {
  getSourceFiles(config: InputPortModel): SourceFile[];
}

@injectable()
export class TSAstProjectLoader implements ITSAstProjectLoader {
  constructor(
    @inject(TYPES.ILogger)
    private logger: Logger<LoggerOptions | DestinationStream>,
    private prj = new Project({
      skipFileDependencyResolution: true,
    })
  ) {}

  getSourceFiles(config: InputPortModel) {
    this.logger.debug("Adding tsconfig file to project");

    const globPattern = this.getGlobPattern(config);

    if (config.tsconfigFilePath) {
      this.logger.info(
        "Detected tsConfig file path, loading files from tsConfig"
      );
      return this.prj.addSourceFilesFromTsConfig(config.tsconfigFilePath);
    }

    this.logger.info(
      "Detected no tsConfig file path, loading files from glob patterns"
    );
    return this.prj.addSourceFilesAtPaths(globPattern);
  }

  private getGlobPattern(config: InputPortModel) {
    return [
      config.componentsSrcFilePath,
      config.excludedSrcFileGlob ? `!${config.excludedSrcFileGlob}` : "",
    ].filter(Boolean);
  }
}
