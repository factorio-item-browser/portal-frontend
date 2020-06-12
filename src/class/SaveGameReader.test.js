import * as fs from "fs";
import SaveGameReader, { Version } from "./SaveGameReader";
import { ERROR_SAVEGAME_INVALID_FILE, ERROR_SAVEGAME_UNSUPPORTED_VERSION } from "../helper/const";

describe("SaveGameReader", () => {
    describe("valid savegames", () => {
        test.each([
            [
                "vanilla",
                "test/asset/savegame/valid/vanilla.zip",
                "0.18.30",
                {
                    base: "0.18.30",
                },
            ],
            [
                "scenario tight-spot", // uses an additional string which must be skipped
                "test/asset/savegame/valid/tight-spot.zip",
                "0.18.30",
                {
                    base: "0.18.30",
                },
            ],
            [
                "2 mods foo and bar",
                "test/asset/savegame/valid/2-mods.zip",
                "0.18.30",
                {
                    base: "0.18.30",
                    foo: "1.0.0",
                    bar: "0.42.0",
                },
            ],
            [
                "mod with uncompressed version",
                "test/asset/savegame/valid/uncompressed-version.zip",
                "0.18.30",
                {
                    base: "0.18.30",
                    foo: "1.0.0",
                    bar: "0.1337.0", // 1337 cannot be compressed in a single byte.
                },
            ],
            [
                "mods with unicode characters",
                "test/asset/savegame/valid/unicode.zip",
                "0.18.30",
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
                "0.18.30",
                {
                    base: "0.18.30",
                    ...(() => {
                        const mods = {};
                        for (let i = 1; i < 300; ++i) {
                            mods[`foo-${i}`] = `0.${i}.0`;
                        }
                        return mods;
                    })(),
                },
            ],
        ])("%s", async (name, file, expectedVersion, expectedMods) => {
            const savegame = fs.readFileSync(file);
            const reader = new SaveGameReader();

            const mods = await reader.read(savegame);

            expect(reader.version).toBeInstanceOf(Version);
            expect(reader.version.toString()).toEqual(expectedVersion);

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
            [
                "missing level.dat file",
                "test/asset/savegame/invalid/missing-level-dat.zip",
                ERROR_SAVEGAME_INVALID_FILE,
            ],
            ["invalid archive file", "test/asset/savegame/invalid/invalid-archive.zip", ERROR_SAVEGAME_INVALID_FILE],
            [
                "unsupported version 0.17",
                "test/asset/savegame/invalid/unsupported-version.zip",
                ERROR_SAVEGAME_UNSUPPORTED_VERSION,
            ],
        ])("%s", async (name, file, expectedError) => {
            const savegame = fs.readFileSync(file);
            const reader = new SaveGameReader();

            await expect(reader.read(savegame)).rejects.toEqual(expectedError);
        });
    });
});
