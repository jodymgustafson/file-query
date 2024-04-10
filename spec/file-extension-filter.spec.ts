import { FileExtensionFilter } from "../src/filters/file-extension-filter"
import { FileInfo } from "../src/util/file-info";

describe("When use file extension filter", () => {
    it("should filter a single extension with Equal including dot", () => {
        const filter = new FileExtensionFilter(".test", "Equal");
        expectAsync(filter.accept(new FileInfo("c://path/file.test"))).toBeResolvedTo(true);
        expectAsync(filter.accept(new FileInfo("c://path/file.foo"))).toBeResolvedTo(false);
    });
    it("should filter a single extension with Equal excluding dot", () => {
        const filter = new FileExtensionFilter("test", "Equal");
        expectAsync(filter.accept(new FileInfo("c://path/file.test"))).toBeResolvedTo(true);
        expectAsync(filter.accept(new FileInfo("c://path/file.foo"))).toBeResolvedTo(false);
    });
    
    it("should filter multiple extensions with In including dot", () => {
        const filter = new FileExtensionFilter(".test, .foo", "In");
        expectAsync(filter.accept(new FileInfo("c://path/file.test"))).toBeResolvedTo(true);
        expectAsync(filter.accept(new FileInfo("c://path/file.foo"))).toBeResolvedTo(true);
        expectAsync(filter.accept(new FileInfo("c://path/file.bar"))).toBeResolvedTo(false);
    });
    it("should filter multiple extensions with Equal excluding dot", () => {
        const filter = new FileExtensionFilter("test, foo", "In");
        expectAsync(filter.accept(new FileInfo("c://path/file.test"))).toBeResolvedTo(true);
        expectAsync(filter.accept(new FileInfo("c://path/file.foo"))).toBeResolvedTo(true);
        expectAsync(filter.accept(new FileInfo("c://path/file.bar"))).toBeResolvedTo(false);
    });

    it("should filter a single extension with NotEqual including dot", () => {
        const filter = new FileExtensionFilter(".test", "NotEqual");
        expectAsync(filter.accept(new FileInfo("c://path/file.test"))).toBeResolvedTo(false);
        expectAsync(filter.accept(new FileInfo("c://path/file.foo"))).toBeResolvedTo(true);
    });
    it("should filter a single extension with NotEqual excluding dot", () => {
        const filter = new FileExtensionFilter("test", "NotEqual");
        expectAsync(filter.accept(new FileInfo("c://path/file.test"))).toBeResolvedTo(false);
        expectAsync(filter.accept(new FileInfo("c://path/file.foo"))).toBeResolvedTo(true);
    });
});