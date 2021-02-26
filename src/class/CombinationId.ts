import { default as baseX } from "base-x";

export class CombinationId {
    private static readonly base16 = baseX("0123456789abcdef");
    private static readonly base62 = baseX("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

    private readonly full: string;
    private readonly short: string;

    private constructor(full: string, short: string) {
        this.full = this.formatFull(full);
        this.short = this.formatShort(short);
    }

    /**
     * Creates a combination id from its full representation, used on the server.
     */
    public static fromFull(full: string): CombinationId {
        const binary = CombinationId.base16.decode(full.replace(/-/g, "").replace(/^0+/, "").substr(-32));
        const short = CombinationId.base62.encode(binary);

        return new CombinationId(full, short);
    }

    /**
     * Creates a combination id from its short representation, used in the address bar.
     */
    public static fromShort(short: string): CombinationId {
        const binary = CombinationId.base62.decode(short.replace(/^0+/, "").substr(-22));
        const full = CombinationId.base16.encode(binary);

        return new CombinationId(full, short);
    }

    public toFull(): string {
        return this.full;
    }

    public toShort(): string {
        return this.short;
    }

    private formatFull(full: string): string {
        const chars = this.fixLength(full.replace(/-/g, ""), 32).split("");
        for (const index of [8, 13, 18, 23]) {
            chars.splice(index, 0, "-");
        }
        return chars.join("");
    }

    private formatShort(short: string): string {
        return this.fixLength(short, 22);
    }

    private fixLength(s: string, length: number): string {
        return s.padStart(length, "0").substr(-length);
    }
}
