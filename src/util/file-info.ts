import { Dirent, read } from "fs";
import { access, readdir, constants } from "fs/promises";
import path from "path";

/** Defines an item in a directory */
class DirectoryItem {
    readonly name: string;
    readonly path: string;

    constructor(readonly file: string | Dirent) {
        if (typeof file === "string") {
            this.name = path.basename(file)
            this.path = path.dirname(file);
        }
        else {
            this.name = file.name;
            this.path = file.path;    
        }
    }

    /** Gets the full path to the file */
    get fullPath(): string {
        return path.join(this.path, this.name);
    }

    getAbsolutePath(): string {
        return path.resolve(this.fullPath);
    }

    /** Checks if the directory exists and user has access */
    async exists(): Promise<boolean> {
        return await access(this.path, constants.R_OK)
            .then(() => true)
            .catch(() => false);
    }
}

export class FileInfo extends DirectoryItem {
    get extension(): string {
        return path.extname(this.name);
    }

    /** Gets the parent directory of this item */
    getDirectory(): DirectoryInfo {
        return new DirectoryInfo(this.path);
    }
}

export class DirectoryInfo extends DirectoryItem {
    async getFiles(): Promise<FileInfo[]> {
        const dirents = await this.getContents();
        return dirents.filter(p => p.isFile()).map(p => new FileInfo(p));
    }

    async getDirectories(): Promise<DirectoryInfo[]> {
        const dirents = await this.getContents();
        return dirents.filter(entry => entry.isDirectory()).map(entry => new DirectoryInfo(entry));
    }

    private _dirents: Dirent[];

    private async getContents(): Promise<Dirent[]> {
        return this._dirents ?? (this._dirents = await readdir(this.getAbsolutePath(), { withFileTypes: true }));
    }
}