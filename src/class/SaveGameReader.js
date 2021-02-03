// @flow

import ByteBuffer from "byte-buffer";
import { Unzip, UnzipInflate, decompressSync } from "fflate";
import { ERROR_SAVEGAME_INVALID_FILE, ERROR_SAVEGAME_UNSUPPORTED_VERSION } from "../const/error";
import type { SaveGameMod } from "../type/savegame";
class SaveGameBuffer {
    /** @private */
    _buffer: ByteBuffer;

    constructor(data: Uint8Array) {
        this._buffer = new ByteBuffer(data, ByteBuffer.LITTLE_ENDIAN);
    }

    readShort(compressed: boolean = true): number {
        if (compressed) {
            const byte = this._buffer.readUnsignedByte();
            return byte !== 255 ? byte : this._buffer.readUnsignedShort();
        }
        return this._buffer.readUnsignedShort();
    }

    readInteger(compressed: boolean = true): number {
        if (compressed) {
            const byte = this._buffer.readUnsignedByte();
            return byte !== 255 ? byte : this._buffer.readUnsignedInt();
        }
        return this._buffer.readUnsignedInt();
    }

    readVersion(compressed: boolean = true): Version {
        return new Version(this.readShort(compressed), this.readShort(compressed), this.readShort(compressed));
    }

    readString(): string {
        const length = this.readInteger();
        return length === 0 ? "" : this._buffer.readString(length);
    }

    seek(offset: number): void {
        this._buffer.seek(offset);
    }

    seekString(): void {
        const length = this.readInteger();
        this.seek(length);
    }
}

export class Version {
    major: number;
    minor: number;
    patch: number;

    constructor(major: number, minor: number, patch: number) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    toString(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    compareTo(version: Version): number {
        const v1 = this.major * 1000000 + this.minor * 1000 + this.patch;
        const v2 = version.major * 1000000 + version.minor * 1000 + version.patch;

        return Math.sign(v1 - v2);
    }
}

class SaveGameReader {
    /**
     * Processes the specified save game file.
     * @param {File} file
     * @return {Promise<SaveGameMod[]>}
     */
    async read(file: File): Promise<SaveGameMod[]> {
        const buffer = await this._extractLevelDatFile(file);
        const version = buffer.readVersion(false);
        if (version.compareTo(new Version(0, 18, 0)) < 0) {
            throw ERROR_SAVEGAME_UNSUPPORTED_VERSION;
        }

        this._seekPosition(buffer);
        return this._readMods(buffer);
    }

    /**
     * Extracts the level.dat file from the save game and returns a buffer of it.
     * @param {File} file
     * @return {Promise<SaveGameBuffer>}
     * @private
     */
    async _extractLevelDatFile(file: File): Promise<SaveGameBuffer> {
        const fileContent = await this._readUploadedFile(file);

        return new Promise((resolve, reject): void => {
            const unzipper = new Unzip();
            unzipper.register(UnzipInflate);
            unzipper.onfile = (file) => {
                if (file.name.endsWith("/level.dat0") || file.name.endsWith("/level.dat")) {
                    file.ondata = (error: Error, data: Uint8Array): void => {
                        if (error) {
                            return reject(ERROR_SAVEGAME_INVALID_FILE);
                        }
                        if (file.name.endsWith("/level.dat0")) {
                            data = decompressSync(data);
                        }
                        resolve(new SaveGameBuffer(data));
                    };
                    file.start();
                }
            };
            unzipper.push(fileContent, true);
            reject(ERROR_SAVEGAME_INVALID_FILE);
        });
    }

    /** @private */
    async _readUploadedFile(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (): void => {
                resolve(new Uint8Array((fileReader.result: any)));
            };
            fileReader.onerror = (): void => {
                reject(ERROR_SAVEGAME_INVALID_FILE);
            };
            fileReader.readAsArrayBuffer(file);
        });
    }

    /**
     * Seeks the correct position to start reading the mod list. Requires the initial version to be already read.
     * @param {SaveGameBuffer} buffer
     * @private
     */
    _seekPosition(buffer: SaveGameBuffer): void {
        buffer.seek(3); // build number, always 0 flag
        buffer.seekString(); // campaign
        buffer.seekString(); // level
        buffer.seekString(); // base mod
        buffer.seek(3); // difficulty, player has finished, player has won
        buffer.seekString(); // next level
        buffer.seek(4); // can continue, has continued, replay, debug options
        buffer.readVersion(); // game version
        buffer.seek(3); // build number, allowed commands
    }

    /**
     * Reads the mods from the buffer. Current position is the number of mods.
     * @param {SaveGameBuffer} buffer
     * @return {SaveGameMod[]}
     * @private
     */
    _readMods(buffer: SaveGameBuffer): SaveGameMod[] {
        const mods = [];
        const count = buffer.readInteger();
        for (let i = 0; i < count; ++i) {
            mods.push({
                name: buffer.readString(),
                version: buffer.readVersion(),
                checksum: buffer.readInteger(false),
            });
        }
        return mods;
    }
}

export default SaveGameReader;
