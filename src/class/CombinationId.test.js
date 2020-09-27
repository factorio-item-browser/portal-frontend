// @flow

import CombinationId from "./CombinationId";

describe("CombinationId", (): void => {
    describe("Auto-format values", (): void => {
        test.each([
            [
                "correct formats",
                "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76",
                "1reA6H5z4uFpotvegbLIr4",
                "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76",
                "1reA6H5z4uFpotvegbLIr4",
            ],
            [
                "too short",
                "ffcf984a7a76",
                "FpotvegbLIr4",
                "00000000-0000-0000-0000-ffcf984a7a76",
                "0000000000FpotvegbLIr4",
            ],
            [
                "too long",
                "1234-2f4a45fa-a509-a9d1-aae6-ffcf984a7a76",
                "12341reA6H5z4uFpotvegbLIr4",
                "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76",
                "1reA6H5z4uFpotvegbLIr4",
            ],
        ])("%s", (name: string, full: string, short: string, expectedFull: string, expectedShort: string): void => {
            const combinationId = new CombinationId(full, short);

            expect(combinationId.toFull()).toBe(expectedFull);
            expect(combinationId.toShort()).toBe(expectedShort);
        });
    });

    describe("Converts full to short", (): void => {
        test.each([
            ["vanilla", "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76", "1reA6H5z4uFpotvegbLIr4"],
            ["all-zero", "00000000-0000-0000-0000-000000000000", "0000000000000000000000"],
            ["single-one", "00000000-0000-0000-0000-000000000001", "0000000000000000000001"],
            ["all-one", "ffffffff-ffff-ffff-ffff-ffffffffffff", "7N42dgm5tFLK9N8MT7fHC7"],
        ])("%s", (name: string, full: string, expectedShort: string): void => {
            const combinationId = CombinationId.fromFull(full);

            expect(combinationId.toFull()).toBe(full);
            expect(combinationId.toShort()).toBe(expectedShort);
        });
    });

    describe("Converts short to full", (): void => {
        test.each([
            ["vanilla", "1reA6H5z4uFpotvegbLIr4", "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76"],
            ["all-zero", "0000000000000000000000", "00000000-0000-0000-0000-000000000000"],
            ["single-one", "0000000000000000000001", "00000000-0000-0000-0000-000000000001"],
            ["all-one", "7N42dgm5tFLK9N8MT7fHC7", "ffffffff-ffff-ffff-ffff-ffffffffffff"],
            ["overflow", "ZZZZZZZZZZZZZZZZZZZZZZ", "f520034c-4307-70c4-2452-8c66503fffff"],
        ])("%s", (name: string, short: string, expectedFull: string): void => {
            const combinationId = CombinationId.fromShort(short);

            expect(combinationId.toShort()).toBe(short);
            expect(combinationId.toFull()).toBe(expectedFull);
        });
    });
});
