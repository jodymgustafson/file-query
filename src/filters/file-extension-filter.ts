import { FileInfo } from "../util/file-info";
import { EqualityFilter } from "./equality-filter";
import { BaseFileQueryFilter, FilterOperator } from "./file-query-filter";
import { PatternFilter } from "./pattern-filter";

export class FileExtensionFilter extends PatternFilter {
    constructor(readonly extension: string | string[], filterOperator: FilterOperator) {
        super("Extension", filterOperator);
    }

    async acceptFile(file: FileInfo): Promise<boolean> {
        switch (this.filterOperator) {
            case "Equal": return file.extension === this.extension;
            case "NotEqual": return file.extension !== this.extension;
            case "In": return file.extension === this.extension;
        }
    }

}