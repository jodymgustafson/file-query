import { FileQueryFilterList } from "./file-query-filter-list";
import { FileQueryError } from "./filters/file-query-filter";
import { Query } from "./query";
import { DirectorySearchSource, FileListSearchSource } from "./search-source";
import { Logger } from "analogging";
import { DirectoryInfo, FileInfo } from "./util/file-info";
import { ExcludeName, ExcludePath } from "./search-exclusion";

export type FileFoundCallback = (path: string) => void;

export type FileQueryResult = {
    /** List of all files found */
    found: string[];
    /** Number of files searched */
    searched: number;
}
export class FileQueryExecutor {
    readonly logger = new Logger("FileQueryExecutor");
    private abortSearch = false;
    private fileCount = 0;
    private excludePaths: Set<string>;
    private excludeNames: Set<string>;

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

    /**
     * Executes a file query async. An instance of this class can only execute one query at a time.
     * To get notified as soon as a file is found set the onFileFound callback function.
     * @param query The query to execute
     * @returns A list of file paths that satisfy the query
     */
    async execute(query: Query): Promise<FileQueryResult> {
        if (this.isRunning) throw new FileQueryError("A query is already running");

        this.logger.isDebugEnabled && this.logger.debug("Starting query at: ", new Date().toISOString());
        this._isRunning = true;
        this.abortSearch = false;
        this.fileCount = 0;
        const results: string[] = [];

        this.excludePaths = new Set(query.excludes.filter((x: any) => x.path).map((x: ExcludePath) => x.path.toLowerCase()));
        this.logger.isDebugEnabled && this.logger.debug("Excluded paths: ", Array.from(this.excludePaths));
        this.excludeNames = new Set(query.excludes.filter((x: any) => x.name).map((x: ExcludeName) => x.name.toLowerCase()));
        this.logger.isDebugEnabled && this.logger.debug("Excluded names: ", Array.from(this.excludeNames));

        for (const source of query.fileSources) {
            if (this.abortSearch) break;

            if ((source as FileListSearchSource).filePaths) {
                // Search in a set of files
                results.push(...(await this.searchFileList(source as FileListSearchSource, query.filters)));
            }
            else if ((source as DirectorySearchSource).path) {
                // Search in a directory
                results.push(...(await this.searchDirectory(source as DirectorySearchSource, query.filters)));
            }
            else {
                throw new FileQueryError("Invalid search source: " + source);
            }
        }

        return {
            found: results,
            searched: this.fileCount
        };
    }

    private async searchDirectory(source: DirectorySearchSource, filters: FileQueryFilterList): Promise<string[]> {
        const directory = new DirectoryInfo(source.path);
        if (!this.isDirectoryExcluded(directory)) {
            if (!await directory.exists()) {
                throw new FileQueryError("Directory does not exist or you don't have permissions: " + source.path);
            }

            return await this.searchDirectoryFiles(directory, source.isRecursive, filters);
        }
        else {
            this.logger.isDebugEnabled && this.logger.debug("Excluded directory: ", directory.path);
        }
    }

    private isDirectoryExcluded(directory: DirectoryInfo) {
        return this.excludePaths.has(directory.fullPath.toLowerCase()) || this.excludeNames.has(directory.name.toLowerCase());
    }

    private async searchDirectoryFiles(directory: DirectoryInfo, isRecursive: boolean, filters: FileQueryFilterList): Promise<string[]> {
        const results: string[] = [];

        if (!this.isDirectoryExcluded(directory)) {
            if (this.abortSearch) return results;

            this.logger.isDebugEnabled && this.logger.debug("Searching directory: ", directory.path);
            try {
                const files = await directory.getFiles();
                results.push(...(await this.testFiles(files, filters)));

                if (isRecursive) {
                    const dirs = await directory.getDirectories();
                    for (const dir of dirs) {
                        results.push(...await this.searchDirectoryFiles(dir, isRecursive, filters));
                    }
                }
            }
            catch (err) {
                this.logger.isDebugEnabled && this.logger.debug(err.message);
            }
        }
        else {
            this.logger.isDebugEnabled && this.logger.debug("Excluded directory: ", directory.path);
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
            this.fileCount++;
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