import { FileInfo } from "../util/file-info";

export type FilterOperator = "Equal" | "NotEqual" |
    "LessThan" | "LessThanEqual" |
    "GreaterThan" | "GreaterThanEqual" |
    "In";

export type FilterType = "Name" | "Extension" | "Contents" | "Size" | "ModifiedDate" | "ReadOnly";

export class FileQueryError extends Error {
}

/**
 * All file filters must implement this interface
 */
export interface FileQueryFilter {
    /**
     * Determines whether the given file is accepted by this filter. 
     * @param file 
     */
    accept(file: FileInfo): Promise<boolean>;

    /** Property to get the name of the filter */
    get filterType(): FilterType;
}

/**
 * Abstract base class for all filters
 */
export abstract class BaseFileQueryFilter implements FileQueryFilter {
    constructor(readonly filterType: FilterType, readonly filterOperator: FilterOperator) {
    }

    /**
     * Implementation of the file test
     * @param file File to test
     */
    abstract acceptFile(file: FileInfo): Promise<boolean>;

    /**
     * Determines whether the given file is accepted by this filter.
     * @param file 
     * @returns 
     */
    async accept(file: FileInfo): Promise<boolean> {
        return await this.acceptFile(file);
    }

    toString(): string {
        return this.filterType + "; op:" + this.filterOperator;
    }
}