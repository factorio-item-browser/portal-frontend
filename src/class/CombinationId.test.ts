import { CombinationId } from "./CombinationId";

describe("CombinationId", () => {
    describe("Converts full to short", () => {
        test.each([
            [
                "vanilla",
                "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76",
                "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76",
                "1reA6H5z4uFpotvegbLIr4",
            ],
            [
                "all-zero",
                "00000000-0000-0000-0000-000000000000",
                "00000000-0000-0000-0000-000000000000",
                "0000000000000000000000",
            ],
            [
                "single-one",
                "00000000-0000-0000-0000-000000000001",
                "00000000-0000-0000-0000-000000000001",
                "0000000000000000000001",
            ],
            [
                "all-one",
                "ffffffff-ffff-ffff-ffff-ffffffffffff",
                "ffffffff-ffff-ffff-ffff-ffffffffffff",
                "7N42dgm5tFLK9N8MT7fHC7",
            ],
            ["too-short", "aae6-ffcf984a7a76", "00000000-0000-0000-aae6-ffcf984a7a76", "00000000000eFHXYlBYpbo"],
            [
                "too-long",
                "1234-2f4a45fa-a509-a9d1-aae6-ffcf984a7a76",
                "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76",
                "1reA6H5z4uFpotvegbLIr4",
            ],
        ])("%s", (name: string, full: string, expectedFull: string, expectedShort: string) => {
            const combinationId = CombinationId.fromFull(full);

            expect(combinationId.toFull()).toBe(expectedFull);
            expect(combinationId.toShort()).toBe(expectedShort);
        });
    });

    describe("Converts short to full", () => {
        test.each([
            ["vanilla", "1reA6H5z4uFpotvegbLIr4", "1reA6H5z4uFpotvegbLIr4", "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76"],
            ["all-zero", "0000000000000000000000", "0000000000000000000000", "00000000-0000-0000-0000-000000000000"],
            ["single-one", "0000000000000000000001", "0000000000000000000001", "00000000-0000-0000-0000-000000000001"],
            ["all-one", "7N42dgm5tFLK9N8MT7fHC7", "7N42dgm5tFLK9N8MT7fHC7", "ffffffff-ffff-ffff-ffff-ffffffffffff"],
            ["overflow", "ZZZZZZZZZZZZZZZZZZZZZZ", "ZZZZZZZZZZZZZZZZZZZZZZ", "f520034c-4307-70c4-2452-8c66503fffff"],
            ["too-short", "eFHXYlBYpbo", "00000000000eFHXYlBYpbo", "00000000-0000-0000-aae6-ffcf984a7a76"],
            [
                "too-long",
                "12341reA6H5z4uFpotvegbLIr4",
                "1reA6H5z4uFpotvegbLIr4",
                "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76",
            ],
        ])("%s", (name: string, short: string, expectedShort: string, expectedFull: string) => {
            const combinationId = CombinationId.fromShort(short);

            expect(combinationId.toShort()).toBe(expectedShort);
            expect(combinationId.toFull()).toBe(expectedFull);
        });
    });
});
