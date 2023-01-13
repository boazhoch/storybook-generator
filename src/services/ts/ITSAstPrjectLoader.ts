
import { Project, SourceFile } from "ts-morph";
import { StoriesConfigRequestModel } from "../../usecases/stories.usecase";


export interface ITSAstProjectLoader {
    loadAstFromConfig(config: StoriesConfigRequestModel): SourceFile[];
}
export class TSAstProjectLoader implements ITSAstProjectLoader {
    constructor(private prj = new Project()) { }

    loadAstFromConfig(config: StoriesConfigRequestModel) {
        console.debug("Adding tsconfig file to project");
        this.prj.addSourceFilesFromTsConfig(config.tsconfigFilePath);

        console.debug("Adding source files to project");
        return this.prj.getSourceFiles([config.componentsSrcFilePath, config.excludedSrcFileGlob || ""]);
    }
}
