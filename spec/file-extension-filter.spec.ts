import { FileExtensionFilter } from "../src/filters/file-extension-filter"
import { FileInfo } from "../src/util/file-info";

describe("When use file extension filter", () => {
    it("should have the correct filterType", () => {
        const filter = new FileExtensionFilter(".test", "Equal");
        expect(filter.filterType).toBe("Extension")
    });
    it("should have the correct filterOperator", () => {
        const filter = new FileExtensionFilter(".test", "Equal");
        expect(filter.filterOperator).toBe("Equal")
    });
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

    it("should fail if the operator is LessThan", () => {
        expect(() => new FileExtensionFilter("test", "LessThan")).toThrowError("Invalid Extension filter operator: LessThan");
    });
    it("should fail if the operator is LessThanEqual", () => {
        expect(() => new FileExtensionFilter("test", "LessThanEqual")).toThrowError("Invalid Extension filter operator: LessThanEqual");
    });
    it("should fail if the operator is GreaterThan", () => {
        expect(() => new FileExtensionFilter("test", "GreaterThan")).toThrowError("Invalid Extension filter operator: GreaterThan");
    });
    it("should fail if the operator is GreaterThanEqual", () => {
        expect(() => new FileExtensionFilter("test", "GreaterThanEqual")).toThrowError("Invalid Extension filter operator: GreaterThanEqual");
    });
});