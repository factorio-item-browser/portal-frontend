import ByteBuffer from "byte-buffer";
import JSZip from "jszip";
import { ERROR_SAVEGAME_INVALID_FILE, ERROR_SAVEGAME_UNSUPPORTED_VERSION } from "../const/error";

/**
 * A helper class wrapping the actual ByteBuffer with additional features.
 */
class Buffer {
    /**
     * The underlying byte buffer used for reading values.
     * @var {ByteBuffer}
     */
    buffer;

    /**
     * Initializes the buffer.
     * @param {*} data
     */
    constructor(data) {
        this.buffer = new ByteBuffer(data, ByteBuffer.LITTLE_ENDIAN);
    }

    /**
     * Reads a version from the buffer.
     * @return {Version}
     */
    readVersion() {
        return new Version(this.readShort(), this.readShort(), this.readShort());
    }

    /**
     * Reads an optimized version from the buffer.
     * @return {Version}
     */
    readOptimizedVersion() {
        return new Version(this.readOptimizedShort(), this.readOptimizedShort(), this.readOptimizedShort());
    }

    /**
     * Reads a short value from the buffer.
     * @return {number}
     */
    readShort() {
        return this.buffer.readUnsignedShort();
    }

    /**
     * Reads an optimized short value from the buffer.
     * @return {number}
     */
    readOptimizedShort() {
        const byte = this.buffer.readUnsignedByte();
        if (byte !== 255) {
            return byte;
        }

        return this.buffer.readUnsignedShort();
    }

    /**
     * Reads an integer value from the buffer.
     * @return {number}
     */
    readInt() {
        return this.buffer.readUnsignedInt();
    }

    /**
     * Reads an optimized integer value from the buffer.
     * @return {number}
     */
    readOptimizedInt() {
        const byte = this.buffer.readUnsignedByte();
        if (byte !== 255) {
            return byte;
        }

        return this.buffer.readUnsignedInt();
    }

    /**
     * Reads a string from the buffer.
     * @return {string}
     */
    readString() {
        const length = this.readOptimizedInt();
        if (length === 0) {
            return "";
        }

        return this.buffer.readString(length);
    }

    /**
     * Seeks some bytes forward in the buffer.
     * @param {number} bytes
     */
    seek(bytes) {
        this.buffer.seek(bytes);
    }

    /**
     * Seeks a string forward in the buffer.
     */
    seekString() {
        const length = this.readOptimizedInt();
        if (length > 0) {
            this.buffer.seek(length);
        }
    }
}

/**
 * Small helper class for the version of the game and of the mods.
 */
export class Version {
    /**
     * The major component of the version.
     * @var {number}
     */
    major;

    /**
     * The minor component of the version.
     * @var {number}
     */
    minor;

    /**
     * The patch component of the version.
     * @var {number}
     */
    patch;

    /**
     * Initializes the version instance.
     * @param {number} major
     * @param {number} minor
     * @param {number} patch
     */
    constructor(major, minor, patch) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    /**
     * Transforms the version into the typical string.
     * @return {string}
     */
    toString() {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    /**
     * Compares the given version to the current one.
     * @param {Version} version
     * @return {number}
     */
    compareTo(version) {
        const v1 = this.major * 1000000 + this.minor * 1000 + this.patch;
        const v2 = version.major * 1000000 + version.minor * 1000 + version.patch;

        return Math.sign(v1 - v2);
    }
}

class SaveGameReader {
    /**
     * The version of the save game.
     * @var {Version}
     */
    version;

    /**
     * Processes the specified save game file.
     * @param {File} file
     * @return {Promise<SaveGameMod[]>}
     */
    async read(file) {
        const buffer = await this._extractLevelDatFile(file);

        this.version = buffer.readVersion();
        if (this.version.compareTo(new Version(0, 18, 0)) < 0) {
            throw ERROR_SAVEGAME_UNSUPPORTED_VERSION;
        }

        this._seekPosition(buffer);
        return this._readMods(buffer);
    }

    /**
     * Extracts the level.dat file from the save game and returns a buffer of it.
     * @param {File} file
     * @return {Promise<Buffer>}
     * @private
     */
    async _extractLevelDatFile(file) {
        let zip;
        try {
            zip = await JSZip.loadAsync(file);
        } catch (e) {
            throw ERROR_SAVEGAME_INVALID_FILE;
        }

        for (const file of Object.values(zip.files)) {
            if (file.name.endsWith("/level.dat")) {
                try {
                    return new Buffer(await file.async("uint8array"));
                } catch (e) {
                    throw ERROR_SAVEGAME_INVALID_FILE;
                }
            }
        }

        throw ERROR_SAVEGAME_INVALID_FILE;
    }

    /**
     * Seeks the correct position to start reading the mod list. Requires the initial version to be already read.
     * @param {Buffer} buffer
     * @private
     */
    _seekPosition(buffer) {
        buffer.seek(3); // build number, always 0 flag
        buffer.seekString(); // campaign
        buffer.seekString(); // level
        buffer.seekString(); // base mod
        buffer.seek(3); // difficulty, player has finished, player has won
        buffer.seekString(); // next level
        buffer.seek(4); // can continue, has continued, replay, debug options
        buffer.readOptimizedVersion(); // game version
        buffer.seek(3); // build number, allowed commands
    }

    /**
     * Reads the mods from the buffer. Current position is the number of mods.
     * @param {Buffer} buffer
     * @return {SaveGameMod[]}
     * @private
     */
    _readMods(buffer) {
        const mods = [];
        const count = buffer.readOptimizedInt();
        for (let i = 0; i < count; ++i) {
            mods.push({
                name: buffer.readString(),
                version: buffer.readOptimizedVersion(),
                checksum: buffer.readInt(),
            });
        }
        return mods;
    }
}

export default SaveGameReader;
