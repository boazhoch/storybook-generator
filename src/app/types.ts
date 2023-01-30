import { StoriesResponseModelWithTemplate } from "../services/story-template";

export interface IStoriesUseCase {
  generateStoriesFromConfig(config: InputPortModel): void;
}

export interface InputPortModel {
  tsconfigFilePath: string;
  componentsSrcFilePath: string;
  excludedSrcFileGlob?: string;
  template?: (storyFileDto: StoriesResponseModelWithTemplate) => string;
}

export interface OutputPortModel {
  name: string;
  srcFilePath: string;
  exportStatements: Array<ExportStatement>;
  template: string;
  storyFilePath: string;
}

export interface ExportStatement {
  exportStatement: string;
  isDefault?: boolean;
}

export interface IRespositroy<T> {
  create(model: T): Promise<T>;
  exist(path: string): boolean;
}

export interface IPresenter<T> {
  presentAll(param: T[]): void;
  abort(msg?: string): void;
  error(err: Error): void;
}

export interface StoryFileDto {
  name: string;
  srcFilePath: string;
  storyFilePath: string;
  template: string;
}
