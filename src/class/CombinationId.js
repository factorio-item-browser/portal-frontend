// @flow

import { default as baseX } from "base-x";

const base62 = baseX("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
const base16 = baseX("0123456789abcdef");

function fixLength(s: string, length: number): string {
    return s.padStart(length, "0").substr(-length);
}

function formatFull(full: string): string {
    const chars = fixLength(full.replace(/-/g, ""), 32).split("");
    for (const index of [8, 13, 18, 23]) {
        chars.splice(index, 0, "-");
    }
    return chars.join("");
}

function formatShort(short: string): string {
    return fixLength(short, 22);
}

export default class CombinationId {
    /**
     * @private
     */
    _full: string;

    /**
     * @private
     */
    _short: string;

    /**
     * Creates a combination id from its full representation, used on the server.
     */
    static fromFull(full: string): CombinationId {
        const binary = base16.decode(full.replace(/-/g, "").replace(/^0+/, ""));
        const short = fixLength(base62.encode(binary), 22);

        return new CombinationId(full, short);
    }

    /**
     * Creates a combination id from its short representation, used in the address bar.
     */
    static fromShort(short: string): CombinationId {
        const binary = base62.decode(short.replace(/^0+/, ""));
        const full = base16.encode(binary);

        return new CombinationId(full, short);
    }

    /**
     * @private
     */
    constructor(full: string, short: string) {
        this._full = formatFull(full);
        this._short = formatShort(short);
    }

    /**
     * Returns the full representation of the combination id, used on the server.
     */
    toFull(): string {
        return this._full;
    }

    /**
     * Returns the short representation of the combination id, used in the address bar.
     */
    toShort(): string {
        return this._short;
    }
}
