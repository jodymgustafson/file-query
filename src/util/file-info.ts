import { Dirent } from "fs";
import { access, readdir, constants } from "fs/promises";
import path from "path";

export class FileInfo {
    constructor(readonly dirEnt: Dirent) {}

    /** Gets the name part of the file */
    get name(): string { 
        return this.dirEnt.name;
    }

    /** Gets the path to the file */
    get path(): string {
        return this.dirEnt.path;
    }

    /** Gets the full path to the file */
    get fullPath(): string {
        return path.join(this.dirEnt.path, this.dirEnt.name);
    }

    get extension(): string {
        return path.extname(this.name);
    }

    getAbsolutePath(): string {
        return path.resolve(this.fullPath);
    }

    /** Gets the directory of the file */
    getDirectory(): DirectoryInfo {
        return new DirectoryInfo(this.dirEnt.path);
    }
}

export class DirectoryInfo { 
    constructor(readonly path: string) {}

    /**
     * Checks if the directory exists and user has access.
     */
    async exists(): Promise<boolean> {
        return await access(this.path, constants.R_OK)
            .then(() => true)
            .catch(() => false);
    }

    async getFiles(): Promise<FileInfo[]> {
        const dirents = await this.getDirEntries();
        return dirents.filter(p => p.isFile()).map(p => new FileInfo(p));
    }

    async getDirectories(): Promise<DirectoryInfo[]> {
        const dirents = await this.getDirEntries();
        return dirents.filter(entry => entry.isDirectory()).map(p => new DirectoryInfo(path.join(p.path, p.name)));
    }

    private _dirents: Dirent[];

    private async getDirEntries(): Promise<Dirent[]> {
        return this._dirents ?? (this._dirents = await readdir(this.path, { withFileTypes: true }));
    }
}