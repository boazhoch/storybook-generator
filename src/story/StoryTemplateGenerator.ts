import { StoryFileTemplateModel } from './AstProject';

export interface StoryTemplateGenerator {
  generate(storyFileDto: StoryFileTemplateModel): string;
}
class StoryTemplate {
  /**
   *
   */
  constructor(private templatebuilder?: (storyFileDto: StoryFileTemplateModel) => string) {
  }

  public generate(storyFileDto: StoryFileTemplateModel) {
    return this.templatebuilder?.(storyFileDto) || `
    // MyComponent.story.js|jsx|ts|tsx

    import ${storyFileDto.isDefualtExport ? storyFileDto.importStr : '{' + storyFileDto.importStr + '}'} from './${storyFileDto.name}';

    export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    // title: ${storyFileDto.importStr},
    component: ${storyFileDto.importStr},
    // decorators: [ ... ],
    // parameters: { ... }
    }

    export const Default = () => <${storyFileDto.importStr} />;
    `;
  }
}
