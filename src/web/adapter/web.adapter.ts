import { StoriesBuilderAdapter } from "../../story/interface";

export class WebAdapter implements StoriesBuilderAdapter {
    constructor(private req: { body: any }) {
    }

    parse() {
        return {
            componentsSrcFilePath: this.req.body.componentsSrcFilePath,
            template: this.req.body.template,
            tsconfigFilePath: this.req.body.tsconfigFilePath,
            excludedSrcFileGlob: this.req.body.excludedSrcFileGlob
        }
    }
}