import { Dirent } from "fs";
import { getFileReader } from "../util/file-util";
import { FilterOperator } from "./file-query-filter";
import { PatternFilter } from "./pattern-filter";

export class FileContentsFilter extends PatternFilter {
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
        super("Contents", pattern, op);
    }

    override async acceptFile(file: Dirent): Promise<boolean> {
        // Set initial state of acceptance
        // If checking "contains" assume not accepted
        // If checking "not contains" assume accepted
        let accepted = (this.filterOperator === "NotEqual");

        const reader = getFileReader(file.path);
        for await (const line of reader) {
            accepted = this.testLine(line);
            if (accepted) break;
        }
        return accepted;
    }

    testLine(line: string): boolean {
        let accept = false;
        for (const re of this.regExpes) {
            // if (Logger.IsDebugEnabled) Logger.Debug("Testing filename: " + file.Name);
            if (re.test(line.toLowerCase())) {
                // If one of the pattern matches we are done
                accept = true;
                break;
            }
        }

        return (this.filterOperator === "NotEqual" ? !accept : accept);
    }
}