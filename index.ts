import { argv } from "process";
import { Query } from "./src/query";
import { FileQueryExecutor } from "./src/file-query-executor";
import * as analog from "analogging";
import { DirectorySearchSource } from "./src/search-source";
import { loadQuerySync } from "./src/query-loader";

analog.configure({
    loggers: [{
        name: "",
        level: analog.LogLevel.Error
    }]
});

(async () => {    
    // const sources = argv.slice(2).map(s => ({
    //     isRecursive: true,
    //     path: s
    // } as DirectorySearchSource));
    // const query = new Query(sources);

    const query = loadQuerySync(argv[2]);
    const exe = new FileQueryExecutor(f => console.log("found:", f));
    await exe.execute(query)
        .then(results => console.log("Found", results.found.length, "files, searched", results.searched, "files."))
        .catch(err => console.error(err.message));
})();