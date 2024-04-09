import { readFileSync } from "fs";
import { Query } from "./query";
import { DirectorySearchSource, SearchSource } from "./search-source";
import { FileQueryError, FilterOperator, FilterType } from "./filters/file-query-filter";
import { FileQueryFilterList } from "./file-query-filter-list";
import { FileContentsFilter } from "./filters/file-contents-filter";
import { FileNameFilter } from "./filters/file-name-filter";
import { ExcludeName, ExcludePath, SearchExclusion } from "./search-exclusion";
import { FileInfo } from "./util/file-info";
import path from "path";
import { FileExtensionFilter } from "./filters/file-extension-filter";

type QueryFilterDefinition = {
    type: FilterType;
    pattern: string;
    operator: FilterOperator;
};

type QueryDefinition = {
    include: SearchSource[];
    exclude?: SearchExclusion[];
    filters?: QueryFilterDefinition[]
};

/**
 * Loads a query from a JSON file
 * @param filePath Path to the JSON file
 * @returns A Query object
 */
export function loadQuerySync(filePath: string): Query {
    const json = readFileSync(filePath, "utf-8");
    const info = JSON.parse(json) as QueryDefinition;

    const basePath = path.resolve(path.dirname(filePath));
    const includes = getIncludes(basePath, info.include);
    const excludes = getExcludes(basePath, info.exclude);
    const filters = getFilters(info.filters);
    
    return new Query(includes, excludes, filters);
}

function getFilters(filters: QueryFilterDefinition[]): FileQueryFilterList {
    const filterList = new FileQueryFilterList();

    for (const filter of filters) {
        switch (filter.type) {
            case "Contents":
                filterList.addFilter(new FileContentsFilter(filter.pattern, filter.operator));
                break;
            case "Name":
                filterList.addFilter(new FileNameFilter(filter.pattern, filter.operator));
                break;
            case "Extension":
                filterList.addFilter(new FileExtensionFilter(filter.pattern, filter.operator));
                break;
            default:
                throw new FileQueryError("Invalid filter type: " + filter.type);
        }
    }

    return filterList;
}

function getIncludes(basePath: string, include: SearchSource[]): SearchSource[] {
    // Make paths relative to the config file
    include.forEach((i: any) => {
        if (i.path) {
            i.path = path.join(basePath, i.path)
        }
        else if (i.filePaths) {
            throw new Error("Not implemented");
        }
        else {
            throw new FileQueryError("Invalid search source: " + JSON.stringify(i));
        }
    });

    return include;
}

function getExcludes(basePath: string, exclude: SearchExclusion[]): SearchExclusion[] {
    // Make paths relative to the config file
    return exclude.map((i: any) => {
        if (i.path) {
            return new ExcludePath(path.join(basePath, i.path));
        }
        else if (i.name) {
            return new ExcludeName(i.name);
        }
        else {
            throw new FileQueryError("Invalid search exclusion: " + JSON.stringify(i));
        }
    });
}

