import { EqualityFilter } from "./equality-filter";
import { FilterOperator, FilterType } from "./file-query-filter";

/**
 * base class for filter that uses a pattern.
 * The pattern can use star and question mark wildcards.
 * TODO: should we use glob instead?
 */
export abstract class PatternFilter extends EqualityFilter {
    protected readonly regExpes: RegExp[] = [];

    constructor(type: FilterType, pattern: string | string[] | RegExp, op?: FilterOperator) {
        super(type, op ?? pattern instanceof Array ? "In" : "Equal");

        if (typeof pattern === "string") {
            this.addPattern(pattern);
        }
        else if (pattern instanceof Array) {
            pattern.forEach(p => this.addPattern(p));
        }
        else if (pattern instanceof RegExp) {
            this.regExpes.push(pattern);
        }
    }

    /**
     * Adds a pattern to the list of patterns to check
     * @param pattern A pattern that can use star and question mark wildcards
     */
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

    override toString(): string {
        return super.toString() + ": " + this.regExpes.map(re => re.source).join(";");
    }
}
