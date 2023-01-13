import { StoriesResponseModel } from '../usecases/stories.usecase';

interface StoriesResponseModelWithTemplate extends Omit<StoriesResponseModel, "template"> {}


export interface IStoryTemplateGenerator {
  generate(storyFileDto: StoriesResponseModelWithTemplate): string;
}
export class StoryTemplate implements IStoryTemplateGenerator {
  /**
   *
   */
  constructor(private templatebuilder?: (storyFileDto: StoriesResponseModelWithTemplate) => string) {
  }

  public generate(storyFileDto: StoriesResponseModelWithTemplate) {
    return this.templatebuilder?.(storyFileDto) || `
    // MyComponent.story.js|jsx|ts|tsx

    import ${storyFileDto.isDefaultExport ? storyFileDto.exportStatementName : '{' + storyFileDto.exportStatementName + '}'} from './${storyFileDto.name}';

    export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    // title: ${storyFileDto.exportStatementName},
    component: ${storyFileDto.exportStatementName},
    // decorators: [ ... ],
    // parameters: { ... }
    }

    export const Default = () => <${storyFileDto.exportStatementName} />;
    `;
  }
}
