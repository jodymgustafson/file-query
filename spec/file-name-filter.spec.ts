import { FileNameFilter } from "../src/filters/file-name-filter";
import { FileInfo } from "../src/util/file-info";

describe("When use file name filter", () => {
    it("should have the correct filterType", () => {
        const filter = new FileNameFilter("test", "Equal");
        expect(filter.filterType).toBe("Name")
    });
    it("should have the correct filterOperator", () => {
        const filter = new FileNameFilter("test", "Equal");
        expect(filter.filterOperator).toBe("Equal")
    });

    it("should filter a single name with Equal", () => {
        const filter = new FileNameFilter("test", "Equal");
        expectAsync(filter.accept(new FileInfo("c://path/test.txt"))).toBeResolvedTo(true);
        expectAsync(filter.accept(new FileInfo("c://path/foo.txt"))).toBeResolvedTo(false);
    });

    it("should filter a single name with NotEqual", () => {
        const filter = new FileNameFilter("test", "Equal");
        expectAsync(filter.accept(new FileInfo("c://path/test.txt"))).toBeResolvedTo(false);
        expectAsync(filter.accept(new FileInfo("c://path/foo.txt"))).toBeResolvedTo(true);
    });

    it("should filter multiple names with In", () => {
        const filter = new FileNameFilter("foo, bar", "In");
        expectAsync(filter.accept(new FileInfo("c://path/bar.txt"))).toBeResolvedTo(true);
        expectAsync(filter.accept(new FileInfo("c://path/test.txt"))).toBeResolvedTo(false);
        expectAsync(filter.accept(new FileInfo("c://path/foo.txt"))).toBeResolvedTo(true);
    });

    it("should filter a regexp with Equal", () => {
        const filter = new FileNameFilter(/t.+t/, "Equal");
        expectAsync(filter.accept(new FileInfo("c://path/test.txt"))).toBeResolvedTo(true);
        expectAsync(filter.accept(new FileInfo("c://path/tmsdjkiusdt.txt"))).toBeResolvedTo(true);
        expectAsync(filter.accept(new FileInfo("c://path/foo.txt"))).toBeResolvedTo(false);
    });
    it("should filter a regexp with NotEqual", () => {
        const filter = new FileNameFilter(/t.+t/, "NotEqual");
        expectAsync(filter.accept(new FileInfo("c://path/test.txt"))).toBeResolvedTo(false);
        expectAsync(filter.accept(new FileInfo("c://path/tmsdjkiusdt.txt"))).toBeResolvedTo(false);
        expectAsync(filter.accept(new FileInfo("c://path/foo.txt"))).toBeResolvedTo(true);
    });

    it("should fail if the operator is LessThan", () => {
        expect(() => new FileNameFilter("test", "LessThan")).toThrowError("Invalid Name filter operator: LessThan");
    });
    it("should fail if the operator is LessThanEqual", () => {
        expect(() => new FileNameFilter("test", "LessThanEqual")).toThrowError("Invalid Name filter operator: LessThanEqual");
    });
    it("should fail if the operator is GreaterThan", () => {
        expect(() => new FileNameFilter("test", "GreaterThan")).toThrowError("Invalid Name filter operator: GreaterThan");
    });
    it("should fail if the operator is GreaterThanEqual", () => {
        expect(() => new FileNameFilter("test", "GreaterThanEqual")).toThrowError("Invalid Name filter operator: GreaterThanEqual");
    });
});