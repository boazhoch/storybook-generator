// const defaultRootSrc = process.env.STORM_DIR;

//     const prj = new Project();
//     const componentsRootFolder = `${defaultRootSrc}/src/management/Storm.Management.Client/`;
//     const componentsSrcFolder = `${componentsRootFolder}/src/components/**/*.tsx`;

//     prj.addSourceFilesFromTsConfig(`${componentsRootFolder}/tsconfig.json`);
//     const sourceFiles = prj.getSourceFiles([
//       componentsSrcFolder,
//       `!${componentsRootFolder}/src/components/**/*.test.tsx`,
//     ]);

//     function isMultipleExports(
//       exports: ReadonlyMap<string, ExportedDeclarations[]>
//     ) {
//       return exports.size > 1;
//     }

//     function extractDefaultExportVarDecleration(
//       exports: ReadonlyMap<string, ExportedDeclarations[]>
//     ) {
//       const namedDefaultExport = 'default';

//       const defaultExport = exports.get(namedDefaultExport);
//       const [decleration] = defaultExport || [];

//       return decleration;
//     }

//     function createStoryComponent(
//       srcFile: SourceFile,
//       handleMultipleDeclarations: (
//         exports: ReadonlyMap<string, ExportedDeclarations[]>
//       ) => ExportedDeclarations
//     ) {
//       const exports = srcFile.getExportedDeclarations();

//       let decleration: undefined | ExportedDeclarations = undefined;

//       if (exports.size === 0) {
//         console.warn(
//           `File has no exported declarations, file name is: ${srcFile.getBaseName()}`
//         );
//         return;
//       }

//       if (isMultipleExports(exports)) {
//         decleration = handleMultipleDeclarations(exports);
//       } else {
//         decleration = exports.values().next().value[0];
//       }

//       if (!Node.isVariableDeclaration(decleration)) {
//         return;
//       }

//       const componentModel = createComponentModel(
//         srcFile.getBaseName(),
//         srcFile.getFilePath(),
//         decleration.getName(),
//         Boolean(srcFile.getDefaultExportSymbol())
//       );

//       return onStoryComponentFileExist(
//         componentStoryFilePath(componentModel.srcFilePath)
//       ).then(storyPath => {
//         const isCreated = writeComponentStory(storyPath, componentModel);

//         return { isCreated, componentModel, storyPath };
//       });
//     }

//     function createComponentModel(
//       name: string,
//       srcFilePath: string,
//       importStr: string,
//       isDefualtExport: boolean
//     ) {
//       return { name, srcFilePath, importStr, isDefualtExport };
//     }

//     function template(comp: ReturnType<typeof createComponentModel>) {
//       return `
// // MyComponent.story.js|jsx|ts|tsx

// import ${
//         comp.isDefualtExport ? comp.importStr : '{' + comp.importStr + '}'
//       } from './${comp.name}';

// export default {
//   /* 👇 The title prop is optional.
//   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
//   * to learn how to generate automatic titles
//   */
//   // title: ${comp.importStr},
//   component: ${comp.importStr},
//   // decorators: [ ... ],
//   // parameters: { ... }
// }

// export const Default = () => <${comp.importStr} />;
// `;
//     }

//     const componentStoryFilePath = (path: string) =>
//       `${path.replace('.tsx', '.stories.tsx')}`;

//     function writeComponentStory(
//       path: string,
//       component: ReturnType<typeof createComponentModel>
//     ) {
//       return new Promise<boolean>((resolve, reject) => {
//         fs.writeFile(path, template(component), err => {
//           if (err) {
//             return reject(err);
//           }
//           return resolve(true);
//         });
//       });
//     }

//     function onStoryComponentFileExist(path: string) {
//       return new Promise<string>(resolve => {
//         fs.access(path, err => {
//           if (!err) {
//             return resolve(
//               `${componentStoryFilePath}`.replace(
//                 '.stories.tsx',
//                 `${v4()}.stories.tsx`
//               )
//             );
//           }
//           return resolve(path);
//         });
//       });
//     }

//     function createStoryFormComponents(srcFiles: SourceFile[]) {
//       return Promise.all(
//         srcFiles
//           .map(s => createStoryComponent(s, extractDefaultExportVarDecleration))
//           .filter(Boolean)
//       );
//     }

//     createStoryFormComponents(sourceFiles).then(values => {
//       console.log(values);
//     });


import { AstProject } from './AstProject';
import { StoriesBuildConfiguration } from "./storiesBuildConfig.dto";

export interface StoriesBuilderUseCase {
  generateStoriesFromConfig(config: StoriesBuildConfiguration): void;
}

export class StoriesUseCase implements StoriesBuilderUseCase {
  constructor(private presnter: StoriesBuilderPreseter, private ast: AstProject) {}
  generateStoriesFromConfig(config: StoriesBuildConfiguration): void {
    this.ast.loadAstFromConfig(config).createStories();
  }
}





