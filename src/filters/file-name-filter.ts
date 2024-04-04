import { Dirent } from "fs";
import { EqualNotEqualFilter } from "./equality-filter";
import { FilterOperator } from "./file-query-filter";

/**
 * Filter for testing file name.
 * The pattern can use star and question mark wildcards.
 * TODO: should we use glob instead?
 */
export class FileNameFilter extends EqualNotEqualFilter {
    private readonly regExpes: RegExp[] = [];

    /// <summary>
    /// Tests that a file matches the specified pattern
    /// </summary>
    /// <param name="pattern">A simple file search pattern, may contain wildcards</param>
    constructor(pattern: string);
    /// <summary>
    /// Tests that a file matches one of the specified patterns (OR)
    /// </summary>
    /// <param name="pattern">A simple file search pattern, may contain wildcards</param>
    constructor(...patterns: string[]);
    /// <summary>
    /// Tests that the pattern satisfies the specified operator
    /// </summary>
    /// <param name="pattern">A simple file search pattern, may contain wildcards</param>
    /// <see cref="DirectoryInfo.GetFiles"/>
    /// <param name="op"></param>
    constructor(pattern: string, op: FilterOperator);
    constructor(regex: RegExp, op: FilterOperator)
    constructor(pattern: string | string[] | RegExp, op?: FilterOperator) {
        super(op ?? pattern instanceof Array ? "In" : "Equal");

        if (pattern instanceof Array) {
            pattern.forEach(p => this.addPattern(p));
        }
        else if (pattern instanceof RegExp) {
            this.regExpes.push(pattern);
        }
    }

    /// <summary>
    /// Converts a string pattern to a regex and adds it to the list of patterns to check
    /// </summary>
    /// <param name="pattern">Can use star and question mark wildcards</param>
    private addPattern(pattern: string): void {
        const re = this.patternToRegExp(pattern);
        this.regExpes.push(re);
    }

    private patternToRegExp(pattern: string): RegExp {
        const exp = pattern.toLowerCase()
            .replace(/\./g, "\\.")
            .replace(/\*/g, ".*")
            .replace(/\?/g, ".{1}");
        return new RegExp(`(^${exp}$)`);
    }

    override async acceptFile(file: Dirent): Promise<boolean> {
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

    override get name(): string {
        return "name";
    }

    override toString(): string {
        return super.toString() + ": " + this.regExpes.map(re => re.source).join(";");
    }
}
