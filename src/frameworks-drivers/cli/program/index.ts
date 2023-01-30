import { Command, Option } from "commander";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../../types";
import { CliOption, ConfigOptions, IConfig } from "../config/cli.config";
import packageJson from "../../../../package.json";
import { camelCase, capitalize } from "lodash";

export interface Options {
  srcf?: string;
  tsc?: string;
  t?: string;
  ex?: string;
}

export interface ICliProgram {
  getOptions(): Options;
}

@injectable()
export class CliProgram implements ICliProgram {
  private CliArgsConfig: ConfigOptions;
  constructor(
    @inject(TYPES.Command) private program: Command,
    @inject(TYPES.IConfig) CliArgumentsConfig: IConfig
  ) {
    this.program
      .name("Story generator")
      .description("Generate stories for your components")
      .version(packageJson.version);

    this.CliArgsConfig = CliArgumentsConfig.getConfig();

    this.addOptions(this.program, this.CliArgsConfig);
  }
  getOptions(): Options {
    this.program.parse();

    const options = this.program.opts<Options>();

    for (let key in options) {
      const keyOption = key as keyof Options;
      options[keyOption.toLocaleLowerCase() as keyof Options] =
        options[keyOption];
    }

    return options;
  }

  private addOption(program: Command, optionConfig: CliOption) {
    const option = this.conifgureOptionConflict(
      new Option(
        `-${optionConfig.shortFlag} <string>, --${optionConfig.longFlag} <string>`,
        `${optionConfig.description}`
      ),
      optionConfig
    );

    program.addOption(option);
  }

  private conifgureOptionConflict(option: Option, optionConfig: CliOption) {
    if (optionConfig.conflict) {
      option.conflicts(optionConfig.conflict.map(capitalize));
    }

    return option;
  }

  private addOptions(program: Command, configOptions: ConfigOptions) {
    Object.values(configOptions).forEach((option) => {
      this.addOption(program, option);
    });
  }
}
