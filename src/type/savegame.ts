import type { Version } from "../class/SaveGameReader";

export type SaveGameMod = {
    name: string,
    version: Version,
    checksum: number,
};
