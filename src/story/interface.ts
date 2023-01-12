import { StoriesBuildConfiguration } from "./storiesBuildConfig.dto";

export interface StoriesBuilderAdapter {
    parse(): StoriesBuildConfiguration
}