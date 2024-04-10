import readline from "readline";
import fs from "fs";

export type ReadStreamOptions = {
    flags?: string | undefined;
    encoding?: BufferEncoding | undefined;
    fd?: number;
    mode?: number | undefined;
    autoClose?: boolean | undefined;
    emitClose?: boolean | undefined;
    start?: number | undefined;
    signal?: AbortSignal | null | undefined;
    highWaterMark?: number | undefined;
};

export function getFileReader(path: string, options?: BufferEncoding | ReadStreamOptions): readline.Interface {
    const stream = fs.createReadStream(path, options);
    return readline.createInterface({
        input: stream
    });
}

export function readTextFileSync(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8")
}