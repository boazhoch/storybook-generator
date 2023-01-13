import { ExportedDeclarations, SourceFile, Node } from "ts-morph";
import { IStoryTemplateGenerator } from "../storyTemplateGenerator";

export interface StoryFileDto {
    name: string;
    srcFilePath: string;
    exportStatementName: string;
    storyFilePath: string;
    isDefaultExport: boolean;
    template: string;
}

export interface IComponentStoryFileFactory {
    create(srcFile: SourceFile): StoryFileDto | undefined;
}

export class ComponentStoryFileFactory implements IComponentStoryFileFactory {
    constructor(private tempalteFileGenerator: IStoryTemplateGenerator) {}

    create(
        srcFile: SourceFile
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
            decleration = this.extractDefaultExportVarDecleration(exports);
        } else {
            decleration = exports.values().next().value[0];
        }

        if (!Node.isVariableDeclaration(decleration)) {
            return;
        }

        const storyFileDto = {
            name:  srcFile.getBaseName(),
            srcFilePath: srcFile.getFilePath(),
            exportStatementName: decleration.getName(),
            storyFilePath: srcFile.getFilePath().replace(".tsx", ".stories.tsx"),
            isDefaultExport: Boolean(srcFile.getDefaultExportSymbol()),
        }

        return {
            ...storyFileDto,
            template: this.tempalteFileGenerator.generate(storyFileDto)
        }
    }

    private extractDefaultExportVarDecleration(
        exports: ReadonlyMap<string, ExportedDeclarations[]>
      ) {
        const namedDefaultExport = 'default';
    
        const defaultExport = exports.get(namedDefaultExport);
        const [decleration] = defaultExport || [];
    
        return decleration;
      }

    private isMultipleExports(
        exports: ReadonlyMap<string, ExportedDeclarations[]>
    ) {
        return exports.size > 1;
    }
}
