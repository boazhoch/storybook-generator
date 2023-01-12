import { Command, Option, program as commanderProgram } from "commander";

import { StoriesBuilderAdapter } from "../../story/interface";
import { StoriesBuildConfiguration } from "../../story/storiesBuildConfig.dto";

interface Options {
    srcf?: string;
    tsc?: string;
    t?: string;
    srcfolder?: string;
    tsconfig?: string;
    template?: string;
    ex?: string;
    excludefiles?: string;
}

const CLI_OPTIONS_STRINGS: {[index: string]: keyof Options} = {
    srcComponentsGlob: "srcf",
    tsconfigFilePath: "tsc",
    template: "t",
    excludeFiles: "ex"
}

const optionsMap = new Map<string, Readonly<keyof Options>>([
    [CLI_OPTIONS_STRINGS.srcComponentsGlob, "srcfolder"],
    [CLI_OPTIONS_STRINGS.tsconfigFilePath, "tsconfig"],
    [CLI_OPTIONS_STRINGS.template, "template"],
    [CLI_OPTIONS_STRINGS.excludeFiles, "excludefiles"]
])

export class CliAdapter implements StoriesBuilderAdapter {
    constructor(private program: Command = commanderProgram) {
        Object.values(CLI_OPTIONS_STRINGS).forEach((value) => {
            this.program
                .addOption(new Option(`${value} <type>`, `${optionsMap.get(value)} <type>`))
        })
    }

    parse(): StoriesBuildConfiguration {
        this.program.parse();
        const options = this.program.opts<Options>();
        return {
            componentsSrcFilePath: options[optionsMap.get(CLI_OPTIONS_STRINGS.srcComponentsGlob) || CLI_OPTIONS_STRINGS.srcComponentsGlob] || "",
            tsconfigFilePath: options[optionsMap.get(CLI_OPTIONS_STRINGS.tsconfigFilePath) || CLI_OPTIONS_STRINGS.tsconfigFilePath] || "",
            excludedSrcFileGlob: options[optionsMap.get(CLI_OPTIONS_STRINGS.excludeFiles) || CLI_OPTIONS_STRINGS.excludeFiles] || "",
            template: options[optionsMap.get(CLI_OPTIONS_STRINGS.temaplte) || CLI_OPTIONS_STRINGS.temaplte] || "",
        }
    }
}