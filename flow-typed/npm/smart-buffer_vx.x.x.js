// flow-typed signature: 83377af7cf9e182b9349ca71dbae4f87
// flow-typed version: <<STUB>>/smart-buffer_v4.1.0/flow_v0.143.1

declare module 'smart-buffer' {
    declare type BufferEncoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";

    declare export interface SmartBufferOptions {
        encoding?: BufferEncoding;
        size?: number;
        buff?: Buffer;
    }

    declare export class SmartBuffer {
        length: number;
        constructor(options?: SmartBufferOptions): SmartBuffer;
        static fromSize(size: number, encoding?: BufferEncoding): SmartBuffer;
        static fromBuffer(buff: Buffer, encoding?: BufferEncoding): SmartBuffer;
        static fromOptions(options: SmartBufferOptions): SmartBuffer;
        readInt8(offset?: number): number;
        readInt16BE(offset?: number): number;
        readInt16LE(offset?: number): number;
        readInt32BE(offset?: number): number;
        readInt32LE(offset?: number): number;
        readBigInt64BE(offset?: number): number;
        readBigInt64LE(offset?: number): number;
        writeInt8(value: number, offset?: number): SmartBuffer;
        insertInt8(value: number, offset: number): SmartBuffer;
        writeInt16BE(value: number, offset?: number): SmartBuffer;
        insertInt16BE(value: number, offset: number): SmartBuffer;
        writeInt16LE(value: number, offset?: number): SmartBuffer;
        insertInt16LE(value: number, offset: number): SmartBuffer;
        writeInt32BE(value: number, offset?: number): SmartBuffer;
        insertInt32BE(value: number, offset: number): SmartBuffer;
        writeInt32LE(value: number, offset?: number): SmartBuffer;
        insertInt32LE(value: number, offset: number): SmartBuffer;
        writeBigInt64BE(value: number, offset?: number): SmartBuffer;
        insertBigInt64BE(value: number, offset: number): SmartBuffer;
        writeBigInt64LE(value: number, offset?: number): SmartBuffer;
        insertBigInt64LE(value: number, offset: number): SmartBuffer;
        readUInt8(offset?: number): number;
        readUInt16BE(offset?: number): number;
        readUInt16LE(offset?: number): number;
        readUInt32BE(offset?: number): number;
        readUInt32LE(offset?: number): number;
        readBigUInt64BE(offset?: number): number;
        readBigUInt64LE(offset?: number): number;
        writeUInt8(value: number, offset?: number): SmartBuffer;
        insertUInt8(value: number, offset: number): SmartBuffer;
        writeUInt16BE(value: number, offset?: number): SmartBuffer;
        insertUInt16BE(value: number, offset: number): SmartBuffer;
        writeUInt16LE(value: number, offset?: number): SmartBuffer;
        insertUInt16LE(value: number, offset: number): SmartBuffer;
        writeUInt32BE(value: number, offset?: number): SmartBuffer;
        insertUInt32BE(value: number, offset: number): SmartBuffer;
        writeUInt32LE(value: number, offset?: number): SmartBuffer;
        insertUInt32LE(value: number, offset: number): SmartBuffer;
        writeBigUInt64BE(value: number, offset?: number): SmartBuffer;
        insertBigUInt64BE(value: number, offset: number): SmartBuffer;
        writeBigUInt64LE(value: number, offset?: number): SmartBuffer;
        insertBigUInt64LE(value: number, offset: number): SmartBuffer;
        readFloatBE(offset?: number): number;
        readFloatLE(offset?: number): number;
        writeFloatBE(value: number, offset?: number): SmartBuffer;
        insertFloatBE(value: number, offset: number): SmartBuffer;
        writeFloatLE(value: number, offset?: number): SmartBuffer;
        insertFloatLE(value: number, offset: number): SmartBuffer;
        readDoubleBE(offset?: number): number;
        readDoubleLE(offset?: number): number;
        writeDoubleBE(value: number, offset?: number): SmartBuffer;
        insertDoubleBE(value: number, offset: number): SmartBuffer;
        writeDoubleLE(value: number, offset?: number): SmartBuffer;
        insertDoubleLE(value: number, offset: number): SmartBuffer;
        readString(arg1?: number | BufferEncoding, encoding?: BufferEncoding): string;
        insertString(value: string, offset: number, encoding?: BufferEncoding): SmartBuffer;
        writeString(value: string, arg2?: number | BufferEncoding, encoding?: BufferEncoding): SmartBuffer;
        readStringNT(encoding?: BufferEncoding): string;
        insertStringNT(value: string, offset: number, encoding?: BufferEncoding): SmartBuffer;
        writeStringNT(value: string, arg2?: number | BufferEncoding, encoding?: BufferEncoding): SmartBuffer;
        readBuffer(length?: number): Buffer;
        insertBuffer(value: Buffer, offset: number): SmartBuffer;
        writeBuffer(value: Buffer, offset?: number): SmartBuffer;
        readBufferNT(): Buffer;
        insertBufferNT(value: Buffer, offset: number): SmartBuffer;
        writeBufferNT(value: Buffer, offset?: number): SmartBuffer;
        clear(): SmartBuffer;
        remaining(): number;
        readOffset: number;
        writeOffset: number;
        encoding: BufferEncoding;
        internalBuffer: Buffer;
        toBuffer(): Buffer;
        toString(encoding?: BufferEncoding): string;
        destroy(): SmartBuffer;
    }
}
