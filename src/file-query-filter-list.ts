import { FileContentsFilter } from "./filters/file-contents-filter";
import { FileQueryFilter } from "./filters/file-query-filter";

/**
 * Manages the list of query filters.
 * Puts filters in order for optimal performance.
 * Tightly coupled to FileQuery.
 */
export class FileQueryFilterList {
    constructor(readonly filters: FileQueryFilter[] = []) {
        this.addFilters(...filters);
    }

    addFilters(...filters: FileQueryFilter[]): void {
        for (const f of filters) {
            this.addFilter(f);
        }
    }

    addFilter(filter: FileQueryFilter) {
        if (filter instanceof FileContentsFilter) {
            // File contents filters are the most labor intensive so add them to the end of the list
            this.filters.push(filter);
        }
        else {
            // Other filters go to the front of the list
            this.filters.unshift(filter);
        }
    }

    *[Symbol.iterator]() {
        for (const f of this.filters) yield f;
    }
}