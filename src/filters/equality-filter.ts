import { BaseFileQueryFilter, FileQueryError, FilterOperator, FilterType } from "./file-query-filter";

/**
 * Base class for filters that only accept Equal, NotEqual or In operators
 */
export abstract class EqualityFilter extends BaseFileQueryFilter {
    constructor(filterType: FilterType, op: FilterOperator) {
        super(filterType, op);
        this.validateOperator();
    }

    protected validateOperator(): void {
        // Check for valid operator
        switch (this.filterOperator) {
            case "Equal":
            case "NotEqual":
            case "In":
                return;
            default:
                throw new FileQueryError(`Invalid ${this.filterType} filter operator: ${this.filterOperator}`);
        }
    }
}
