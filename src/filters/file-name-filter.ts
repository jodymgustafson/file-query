import { FileInfo } from "../util/file-info";
import { EqualityFilter } from "./equality-filter";
import { FilterOperator } from "./file-query-filter";
import { PatternFilter } from "./pattern-filter";

/**
 * Filter for testing file name.
 * The pattern can use star and question mark wildcards.
 * TODO: should we use glob instead?
 */
export class FileNameFilter extends PatternFilter {
    /**
     * Tests that a file matches the specified pattern
     * @param pattern A simple file search pattern, may contain wildcards
     */
    constructor(pattern: string);
    /**
     * Tests that a file matches one of the specified patterns (OR)
     * @param patterns A simple file search pattern, may contain wildcards
     */
    constructor(...patterns: string[]);
    /**
     * Tests that the pattern satisfies the specified operator
     * @param pattern Tests that the pattern satisfies the specified operator
     * @param op The filter operator
     */
    constructor(pattern: string, op: FilterOperator);
    /**
     * Tests that the regular expression satisfies the specified operator
     * @param regex A regular expression
     * @param op The filter operator
     */
    constructor(regex: RegExp, op: FilterOperator)
    constructor(pattern: string | string[] | RegExp, op?: FilterOperator) {
        super("Name", pattern, op);
    }

    protected override async acceptFile(file: FileInfo): Promise<boolean> {
        let accept = false;
        for (const re of this.regExpes) {
            // if (Logger.IsDebugEnabled) Logger.Debug("Testing filename: " + file.Name);
            if (re.test(file.name.toLowerCase())) {
                // If one of the pattern matches we are done
                accept = true;
                break;
            }
        }
        return (this.filterOperator === "NotEqual" ? !accept : accept);
    }
}
