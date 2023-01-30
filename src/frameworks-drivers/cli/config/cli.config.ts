import { injectable } from "inversify";
import "reflect-metadata";

export type ConfigOptions = {
  [index: string]: CliOptionConfig;
};

export const CONFIG: ConfigOptions = {
  srcComponentsGlob: {
    isRequired: false,
    description: "components source folder path",
    shortFlag: "srcf",
    longFlag: "sourcefile",
    conflict: ["tsconfig", "tsc"],
  },
  tsconfigFilePath: {
    conflict: ["sourcefile", "srcf"],
    isRequired: false,
    description: "tsconfig.json file path",
    shortFlag: "tsc",
    longFlag: "tsconfig",
  },
  template: {
    isRequired: false,
    description: `pass a template function to generate story, it should return the template as string - function signature is: (storyFileDto: { name: string; srcFilePath: string; storyFilePath: string;}) => string`,
    shortFlag: "t",
    longFlag: "template",
  },
  excludeFiles: {
    isRequired: false,
    description: "exclude files glob",
    shortFlag: "ex",
    longFlag: "excludefiles",
  },
};

export type IConfig = {
  getConfig(): ConfigOptions;
};

@injectable()
class Config implements IConfig {
  constructor(private config = CONFIG) {}

  getConfig() {
    return this.config;
  }
}

type CliOptionConfig = {
  conflict?: string[];
  isRequired?: boolean;
  description: string;
  shortFlag: string;
  longFlag: string;
};

export { CliOptionConfig as CliOption, Config };
