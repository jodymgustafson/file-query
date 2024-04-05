import { FileQueryFilterList } from "./file-query-filter-list";
import { FileQueryFilter } from "./filters/file-query-filter";
import { SearchExclusion } from "./search-exclusion";
import { SearchSource } from "./search-source";

export class Query {
    /** List of paths and result sets to include in the search */
    readonly fileSources: SearchSource[];

    /** List of paths to exclude from the search */
    readonly excludePaths: SearchExclusion[];

    /** List of filters to apply during search */
    readonly filters: FileQueryFilterList;

    constructor(fileSources: SearchSource[] = [], excludePaths: SearchExclusion[] = [], filters = new FileQueryFilterList()) {
        this.fileSources = fileSources;
        this.excludePaths = excludePaths;
        this.filters = filters;
    }

    public addFileSource(src: SearchSource): void {
        this.fileSources.push(src);
    }

    public addExcludePath(path: SearchExclusion): void {
        this.excludePaths.push(path);
    }

    public addFilter(filter: FileQueryFilter): void {
        this.filters.addFilter(filter);
    }
}