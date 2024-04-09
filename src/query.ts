import { FileQueryFilterList } from "./file-query-filter-list";
import { FileQueryFilter } from "./filters/file-query-filter";
import { SearchExclusion } from "./search-exclusion";
import { SearchSource } from "./search-source";

export class Query {
    /** List of paths and result sets to include in the search */
    readonly fileSources: SearchSource[];

    /** List of paths to exclude from the search */
    readonly excludes: SearchExclusion[];

    /** List of filters to apply during search */
    readonly filters: FileQueryFilterList;

    constructor(fileSources: SearchSource[] = [], excludes: SearchExclusion[] = [], filters = new FileQueryFilterList()) {
        this.fileSources = fileSources;
        this.excludes = excludes;
        this.filters = filters;
    }

    public addFileSource(src: SearchSource): void {
        this.fileSources.push(src);
    }

    public addExclude(path: SearchExclusion): void {
        this.excludes.push(path);
    }

    public addFilter(filter: FileQueryFilter): void {
        this.filters.addFilter(filter);
    }
}