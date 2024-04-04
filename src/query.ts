import { FileQueryFilterList } from "./file-query-filter-list";
import { FileQueryFilter } from "./filters/file-query-filter";
import { SearchSource } from "./search-source";

export class Query {
    /** List of paths and result sets to include in the search */
    readonly fileSources: SearchSource[];

    /** List of paths to exclude from the search */
    readonly excludePaths: string[];

    /** List of filters to apply during search */
    readonly filters: FileQueryFilterList;

    constructor(fileSources: any[], filters = new FileQueryFilterList(), excludePaths?: string[]) {
        this.fileSources = fileSources;
        this.excludePaths = excludePaths ?? [];
        this.filters = filters;
    }

    public addFileSource(src: SearchSource): void {
        this.fileSources.push(src);
    }

    public addExcludePath(path: string): void {
        this.excludePaths.push(path);
    }

    public addFilter(filter: FileQueryFilter): void {
        this.filters.addFilter(filter);
    }
}