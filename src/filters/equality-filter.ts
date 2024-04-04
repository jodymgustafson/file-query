import { BaseFileQueryFilter, FileQueryError, FilterOperator } from "./file-query-filter";

/**
 * Base class for filters that only accept = or <> operators
 */
export abstract class EqualNotEqualFilter extends BaseFileQueryFilter {
    constructor(op: FilterOperator) {
        super(op);
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
                throw new FileQueryError(`Invalid ${this.name} filter operator: ${this.filterOperator}`);
        }
    }
}
