import { StoriesConfigRequestModel } from "./stories.usecase";

export interface IStoriesBuilderAdapter {
  parse(): StoriesConfigRequestModel;
}
