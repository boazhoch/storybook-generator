export interface StoriesBuildConfiguration {
    tsconfigFilePath: string;
    componentsSrcFilePath: string;
    excludedSrcFileGlob?: string;
    template: string;
}