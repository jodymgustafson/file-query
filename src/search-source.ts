/** Defines a directory to search in */
export type DirectorySearchSource = {
    path: string;
    isRecursive: boolean;
};

/** Defines a list of files to search in */
export type FileListSearchSource = {
    filePaths: string[];
}

export type SearchSource = DirectorySearchSource | FileListSearchSource;