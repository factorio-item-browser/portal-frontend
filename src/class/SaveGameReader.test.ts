import * as fs from "fs";
import { InvalidFileError, UnsupportedVersionError } from "../error/savegame";
import { SaveGameReader } from "./SaveGameReader";

describe("SaveGameReader", () => {
    describe("valid savegames", () => {
        test.each([
            [
                "vanilla (0.18.30)",
                "test/asset/savegame/valid/vanilla.zip",
                {
                    base: "0.18.30",
                },
            ],
            [
                "vanilla (1.1.19)",
                "test/asset/savegame/valid/vanilla_1.1.19.zip",
                {
                    base: "1.1.19",
                },
            ],
            [
                "scenario tight-spot (0.18.30)", // uses an additional string which must be skipped
                "test/asset/savegame/valid/tight-spot.zip",
                {
                    base: "0.18.30",
                },
            ],
            [
                "scenario tight-spot (1.1.19)", // uses an additional string which must be skipped
                "test/asset/savegame/valid/tight-spot_1.1.19.zip",
                {
                    base: "1.1.19",
                },
            ],
            [
                "2 mods foo and bar",
                "test/asset/savegame/valid/2-mods.zip",
                {
                    base: "0.18.30",
                    foo: "1.0.0",
                    bar: "0.42.0",
                },
            ],
            [
                "mod with uncompressed version",
                "test/asset/savegame/valid/uncompressed-version.zip",
                {
                    base: "0.18.30",
                    foo: "1.0.0",
                    bar: "0.1337.0", // 1337 cannot be compressed in a single byte.
                },
            ],
            [
                "mods with unicode characters",
                "test/asset/savegame/valid/unicode.zip",
                {
                    "base": "0.18.30",
                    "foo": "1.0.0",
                    "\u{79D8}\u{5BC6}": "0.42.0", // Japanese characters
                    "Praise the \u{D83D}\u{DCA9}": "0.21.0", // Emoji
                },
            ],
            [
                "300 mods", // Uses uncompressed 32bit number for mod count
                "test/asset/savegame/valid/300-mods.zip",
                {
                    base: "0.18.30",
                    ...(() => {
                        const mods: { [key: string]: string } = {};
                        for (let i = 1; i < 300; ++i) {
                            mods[`foo-${i}`] = `0.${i}.0`;
                        }
                        return mods;
                    })(),
                },
            ],
        ])("%s", async (name: string, file: string, expectedMods: { [key: string]: string }) => {
            const savegame = fs.readFileSync(file);
            const reader = new SaveGameReader();

            jest.spyOn(reader, "readUploadedFile").mockImplementation(() => Promise.resolve(savegame));

            const mods = await reader.read(new Blob([savegame]));

            for (const mod of mods) {
                const expectedVersion = expectedMods[mod.name];
                if (!expectedVersion) {
                    throw `Mod "${mod.name}" was not expected.`;
                }

                expect(mod.version.toString()).toEqual(expectedVersion);
                delete expectedMods[mod.name];
            }

            expect(expectedMods).toEqual({});
        });
    });

    describe("invalid savegames", () => {
        test.each([
            ["missing level.dat file", "test/asset/savegame/invalid/missing-level-dat.zip", InvalidFileError],
            ["invalid archive file", "test/asset/savegame/invalid/invalid-archive.zip", InvalidFileError],
            [
                "unsupported version 0.17",
                "test/asset/savegame/invalid/unsupported-version.zip",
                UnsupportedVersionError,
            ],
        ])("%s", async (name, file, expectedError) => {
            const savegame = fs.readFileSync(file);
            const reader = new SaveGameReader();

            jest.spyOn(reader, "readUploadedFile").mockImplementation(() => Promise.resolve(savegame));

            await expect(reader.read(new Blob([savegame]))).rejects.toBeInstanceOf(expectedError);
        });
    });
});
