import { readFileSync } from "fs";
import { Query } from "./query";
import { SearchSource } from "./search-source";
import { FilterOperator, FilterType } from "./filters/file-query-filter";
import { FileQueryFilterList } from "./file-query-filter-list";
import { FileContentsFilter } from "./filters/file-contents-filter";
import { FileNameFilter } from "./filters/file-name-filter";

type QueryFilterDefinition = {
    type: FilterType;
    pattern: string;
    operator: FilterOperator;
};

type QueryDefinition = {
    fileSources: SearchSource[];
    excludePaths?: string[];
    filters?: QueryFilterDefinition[]
};

export function loadQuerySync(path: string): Query {
    const json = readFileSync(path, "utf-8");
    const info = JSON.parse(json) as QueryDefinition;
    return new Query(info.fileSources, getFilters(info.filters), info.excludePaths);
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
            default:
                throw new Error("Invalid filter type: " + filter.type);
        }
    }

    return filterList;
}
