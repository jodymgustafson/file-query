import { Dirent } from "fs";
import { BaseFileQueryFilter } from "./file-query-filter";
import { FileNameFilter } from "./file-name-filter";
import { getFileReader } from "../util/file-util";

export class FileContentsFilter extends FileNameFilter {
    override async acceptFile(file: Dirent): Promise<boolean> {
        // Set initial state of acceptance
        // If checking "contains" assume not accepted
        // If checking "not contains" assume accepted
        let accepted = (this.filterOperator === "NotEqual");

        const reader = getFileReader(file.path);
        for await (const line of reader) {
            
        }
        return accepted;
    }

    get name(): string {
        return "contents";
    }
}