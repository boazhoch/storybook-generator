import { inject, injectable } from "inversify";
import {
  ExportedDeclarations,
  SourceFile,
  Node,
  SyntaxKind,
  ExportDeclaration,
} from "ts-morph";
import { IStoryTemplateGenerator } from "../storyTemplateGenerator";
import "reflect-metadata";
import { StoryFileDto } from "../../usecases/types";

export interface IComponentStoryFileFactory {
  create(srcFile: SourceFile): StoryFileDto | undefined;
}

@injectable()
export class ComponentStoryFileFactory implements IComponentStoryFileFactory {
  constructor(
    @inject("tempalteFileGenerator")
    private tempalteFileGenerator: IStoryTemplateGenerator
  ) {}

  create(srcFile: SourceFile) {
    const exports = srcFile.getExportedDeclarations();

    if (exports.size === 0) {
      console.warn(
        `File has no exported declarations, file name is: ${srcFile.getBaseName()}`
      );
      return;
    }

    const reactComponentDeclarations =
      this.getVaraibleDeclarationsWithJsxElement(exports);

    const getName = (declaration: Node) => {
      if (Node.hasName(declaration)) {
        return declaration.getName() || "Default";
      }
      return "Default";
    };

    const storyFileDto = {
      name: srcFile.getBaseName(),
      srcFilePath: srcFile.getFilePath(),
      exportStatements: reactComponentDeclarations.map((exportDeclaration) => {
        const name = getName(exportDeclaration);

        return {
          exportStatement: name,
          isDefault: name === "Default",
        };
      }),
      storyFilePath: srcFile.getFilePath().replace(".tsx", `.stories.tsx`),
    };

    return {
      ...storyFileDto,
      template: this.tempalteFileGenerator.generate(storyFileDto),
    };
  }

  private isJsxReturnType(node: ExportedDeclarations) {
    if (
      node.isKind(SyntaxKind.ArrowFunction) ||
      node.isKind(SyntaxKind.FunctionDeclaration)
    ) {
      const returnType = node.getReturnType();
      return returnType.getText() === "JSX.Element";
    }
  }

  private getVaraibleDeclarationsWithJsxElement(
    exports: ReadonlyMap<string, ExportedDeclarations[]>
  ) {
    const mapped = [...exports]
      .map(([key, value]) => value)
      .flat()
      .filter((exportDeclaration) => {
        if (this.isJsxReturnType(exportDeclaration)) {
          return true;
        }
        const isJSX = exportDeclaration.getChildren().find((node) => {
          if (Node.isFunctionLikeDeclaration(node)) {
            const returnType = node.getReturnType();
            return returnType.getText() === "JSX.Element";
          }
        });

        return isJSX;
      });

    return mapped;
  }
}
