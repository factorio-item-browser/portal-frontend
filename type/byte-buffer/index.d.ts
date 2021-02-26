declare module "byte-buffer" {
    export class ByteBuffer {
        static LITTLE_ENDIAN: true;
        static BIG_ENDIAN: false;

        constructor(source: any, order?: boolean, implicitGrowth?: boolean);
        read(bytes?: number): ByteBuffer;
        readString(bytes?: number): string;
        readByte(): number;
        readUnsignedByte(): number;
        readShort(): number;
        readUnsignedShort(): number;
        readInt(): number;
        readUnsignedInt(): number;
        seek(bytes: number): ByteBuffer;
    }

    export default ByteBuffer;
}