import { getLogger } from "analogging";
import { FileInfo } from "../util/file-info";
import { FilterOperator } from "./file-query-filter";
import { PatternFilter } from "./pattern-filter";

export class FileExtensionFilter extends PatternFilter {
    private readonly logger = getLogger("FileExtensionFilter");
    constructor(extension: string, filterOperator: FilterOperator) {
        super("Extension", extension, filterOperator);
    }
    
    protected override addPattern(pattern: string): void {
        super.addPattern(this.normalizeExt(pattern))
    }

    private normalizeExt(ext: string): string {
        // Remove the preceding dot from extension
        return (ext[0] !== "." ? "." + ext : ext);
    }

    protected override async acceptFile(file: FileInfo): Promise<boolean> {
        let accept = false;
        for (const re of this.regExpes) {
            this.logger.isDebugEnabled && this.logger.debug("Testing extension: ", file.name);
            if (re.test(file.extension.toLowerCase())) {
                // If one of the pattern matches we are done
                accept = true;
                break;
            }
        }
        return (this.filterOperator === "NotEqual" ? !accept : accept);
    }
}