import { DirectoryInfo } from "./util/file-info";

export abstract class SearchExclusion {
    abstract isExcluded(path: DirectoryInfo): boolean;
}

export class ExcludePath extends SearchExclusion {
    constructor(readonly path: string) {
        super();
    }

    isExcluded(directory: DirectoryInfo): boolean {
        return directory.path === this.path;
    }
}

export class ExcludeName extends SearchExclusion {
    constructor(readonly name: string) {
        super();
    }

    isExcluded(directory: DirectoryInfo): boolean {
        return directory.name === this.name;
    }
}
