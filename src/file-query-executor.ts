import { FileQueryFilterList } from "./file-query-filter-list";
import { FileQueryError } from "./filters/file-query-filter";
import { Query } from "./query";
import { DirectorySearchSource, FileListSearchSource } from "./search-source";
import { Logger } from "analogging";
import { DirectoryInfo, FileInfo } from "./util/file-info";

export type FileFoundCallback = (path: string) => void;

export class FileQueryExecutor {
    readonly logger = new Logger("FileQueryExecutor");
    private abortSearch = false;

    private _isRunning = false;
    get isRunning(): boolean {
        return this._isRunning;
    }

    /** A callback function called when a file is found */
    readonly onFileFound: FileFoundCallback;

    constructor(onFileFound?: FileFoundCallback) {
        this.onFileFound = onFileFound;
    }

    cancel(): void {
        this.abortSearch = true;
    }

    async execute(query: Query): Promise<string[]> {
        if (this.isRunning) throw new FileQueryError("A query is already running");

        this.logger.isDebugEnabled && this.logger.debug("Starting query at: ", new Date().toISOString());
        this._isRunning = true;
        this.abortSearch = false;
        const results: string[] = [];

        const excludePaths = new Set(query.excludePaths.map((x: any) => (x.path ?? x.name).toLowerCase()));

        for (const source of query.fileSources) {
            if (this.abortSearch) break;

            if ((source as FileListSearchSource).filePaths) {
                // Search in a set of files
                results.push(...(await this.searchFileList(source as FileListSearchSource, query.filters)));
            }
            else if ((source as DirectorySearchSource).path) {
                // Search in a directory
                results.push(...(await this.searchDirectory(source as DirectorySearchSource, excludePaths, query.filters)));
            }
            else {
                throw new FileQueryError("Invalid search source: " + source);
            }
        }

        return results;
    }

    private async searchDirectory(source: DirectorySearchSource, excludePaths: Set<string>, filters: FileQueryFilterList): Promise<string[]> {
        if (!excludePaths.has(source.path.toLowerCase())) {
            const directory = new DirectoryInfo(source.path);
            if (!await directory.exists()) {
                throw new FileQueryError("Directory does not exist or you don't have permissions: " + source.path);
            }

            return await this.searchDirectoryFiles(directory, source.isRecursive, excludePaths, filters);
        }
    }

    private async searchDirectoryFiles(directory: DirectoryInfo, isRecursive: boolean, excludePaths: Set<string>, filters: FileQueryFilterList): Promise<string[]> {
        const results: string[] = [];

        if (!excludePaths.has(directory.path.toLowerCase())) {
            if (this.abortSearch) return results;

            this.logger.isDebugEnabled && this.logger.debug("Searching directory: ", directory.path);
            try {
                const files = await directory.getFiles();
                results.push(...(await this.testFiles(files, filters)));

                if (isRecursive) {
                    const dirs = await directory.getDirectories();
                    for (const dir of dirs) {
                        results.push(...await this.searchDirectoryFiles(dir, isRecursive, excludePaths, filters));
                    }
                }
            }
            catch (err) {
                this.logger.isDebugEnabled && this.logger.debug(err.message);
            }
        }

        return results;
    }

    private async searchFileList(source: FileListSearchSource, filters: FileQueryFilterList): Promise<string[]> {
        throw new Error("Method not implemented.");
    }

    private async testFiles(files: FileInfo[], filters: FileQueryFilterList): Promise<string[]> {
        const results: string[] = [];

        for (const file of files) {
            if (this.abortSearch) break;
            if (await this.testFile(file, filters)) {
                this.logger.isDebugEnabled && this.logger.debug("File passed all filters: ", file);
                const filePath = file.getAbsolutePath();
                results.push(filePath);
                this.onFileFound && this.onFileFound(filePath);
            }
        }

        return results;
    }

    private async testFile(file: FileInfo, filters: FileQueryFilterList): Promise<boolean> {
        this.logger.isDebugEnabled && this.logger.debug("Testing file: ", file);

        let accept = true;
        for (const filter of filters) {
            if (this.abortSearch || !accept) {
                // No need to continue
                break;
            }

            // Apply the filter
            this.logger.isDebugEnabled && this.logger.debug("Checking filter: ", filter.toString());
            accept = await filter.accept(file);
        }

        return accept;
    }
}