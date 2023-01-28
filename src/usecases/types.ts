export interface IStoriesUseCase {
  generateStoriesFromConfig(config: StoriesInboundPortModel): void;
}

export interface StoriesInboundPortModel {
  tsconfigFilePath: string;
  componentsSrcFilePath: string;
  excludedSrcFileGlob?: string;
  template: string;
}

export interface ExportStatement {
  exportStatement: string;
  isDefault?: boolean;
}

export interface StoriesResponseModel {
  name: string;
  srcFilePath: string;
  exportStatements: Array<ExportStatement>;
  template: string;
  storyFilePath: string;
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
