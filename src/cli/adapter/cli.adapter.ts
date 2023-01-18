import { Command, Option, program as commanderProgram } from "commander";

import { IStoriesBuilderAdapter } from "../../usecases/storiesBuilderAdapter";
import { StoriesConfigRequestModel } from "../../usecases/stories.usecase";


interface Options {
    srcf?: string;
    tsc?: string;
    t?: string;
    ex?: string;
}

const CLI_OPTIONS_STRINGS: {[index: string]: keyof Options} = {
    srcComponentsGlob: "srcf",
    tsconfigFilePath: "tsc",
    template: "t",
    excludeFiles: "ex"
}

const CLI_OPTIONS_STRINGS_DESC: {[k in keyof typeof CLI_OPTIONS_STRINGS]: string} = {
    srcComponentsGlob: "components source folder path",
    tsconfigFilePath: "tsconfig.json file path",
    template: "template",
    excludeFiles: "exclude files glob"
}

export class CliAdapter implements IStoriesBuilderAdapter {
    constructor(private program: Command = commanderProgram) {
        Object.entries(CLI_OPTIONS_STRINGS).forEach(([key,value]) => {
            this.program
                .addOption(new Option(`-${value} <string>`, `${CLI_OPTIONS_STRINGS_DESC[key]}`))
        })
    }

    parse(): StoriesConfigRequestModel {
        this.program.parse();
        const options = this.program.opts<Options>();

        const opts = Object.keys(options).reduce((prevValue, currentValue) => {
            return {...prevValue, [currentValue.toLocaleLowerCase()]: options[currentValue as keyof typeof options]}
        }, {} as Options)

        return {
            componentsSrcFilePath: opts[CLI_OPTIONS_STRINGS.srcComponentsGlob] || "",
            tsconfigFilePath: opts[CLI_OPTIONS_STRINGS.tsconfigFilePath] || "",
            template: opts[CLI_OPTIONS_STRINGS.temaplte] || "",
            excludedSrcFileGlob: opts[CLI_OPTIONS_STRINGS.excludeFiles],
        }
    }
}