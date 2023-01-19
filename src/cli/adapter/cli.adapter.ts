import { Command, Option, program as commanderProgram } from "commander";

import { IStoriesBuilderAdapter } from "../../usecases/storiesBuilderAdapter";
import { StoriesConfigRequestModel } from "../../usecases/stories.usecase";
import { injectable } from "inversify";
import "reflect-metadata";

interface Options {
  srcf?: string;
  tsc?: string;
  t?: string;
  ex?: string;
}

const CLI_OPTIONS = {
  srcComponentsGlob: {
    required: true,
    description: "components source folder path",
    flag: "srcf",
  },
  tsconfigFilePath: {
    required: true,
    description: "tsconfig.json file path",
    flag: "tsc",
  },
  template: {
    required: false,
    description: "template",
    flag: "t",
  },
  excludeFiles: {
    required: false,
    description: "exclude files glob",
    flag: "ex",
  },
};

@injectable()
export class CliAdapter implements IStoriesBuilderAdapter {
  constructor(private program: Command = commanderProgram) {
    Object.values(CLI_OPTIONS).forEach(value => {
      if (value.required) {
        this.program.requiredOption(
          `-${value.flag} <string>`,
          `${value.description}`
        );
        return;
      }
      this.program.addOption(
        new Option(`-${value.flag} <string>`, `${value.description}`)
      );
    });
  }

  parse(): StoriesConfigRequestModel {
    this.program.parse();
    const options = this.program.opts<Options>();

    const opts = Object.keys(options).reduce((prevValue, currentValue) => {
      return {
        ...prevValue,
        [currentValue.toLocaleLowerCase()]: options[
          currentValue as keyof typeof options
        ],
      };
    }, {} as Options);

    return {
      componentsSrcFilePath:
        opts[CLI_OPTIONS.srcComponentsGlob.flag as keyof Options] || "",
      tsconfigFilePath:
        opts[CLI_OPTIONS.tsconfigFilePath.flag as keyof Options] || "",
      template: opts[CLI_OPTIONS.template.flag as keyof Options] || "",
      excludedSrcFileGlob: opts[CLI_OPTIONS.excludeFiles.flag as keyof Options],
    };
  }
}
