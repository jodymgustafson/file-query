import { FileInfo } from "../util/file-info";
import { FilterOperator } from "./file-query-filter";
import { PatternFilter } from "./pattern-filter";

export class FileExtensionFilter extends PatternFilter {
    constructor(extension: string, filterOperator: FilterOperator) {
        super("Extension", extension, filterOperator);
    }
    
    protected override addPattern(pattern: string): void {
        super.addPattern(this.normalizeExt(pattern))
    }

    private normalizeExt(ext: string): string {
        // Remove the preceding dot from extension
        return (ext[0] === "." ? ext.slice(1) : ext);
    }

    override async acceptFile(file: FileInfo): Promise<boolean> {
        let accept = false;
        for (const re of this.regExpes) {
            // if (Logger.IsDebugEnabled) Logger.Debug("Testing extension: " + file.Name);
            // Remove the preceding dot from extension
            if (re.test(file.extension.slice(1).toLowerCase())) {
                // If one of the pattern matches we are done
                accept = true;
                break;
            }
        }
        return (this.filterOperator === "NotEqual" ? !accept : accept);
    }
}