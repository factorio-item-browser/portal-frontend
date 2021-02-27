// flow-typed signature: 0825c87dd864ba2ab8ed6040f90cfe1e
// flow-typed version: <<STUB>>/byte-buffer_v2.0.0/flow_v0.143.1
// This definition is partial and only declares as much as needed to have flow run successfully on this project.

declare module "byte-buffer" {
    declare class ByteBuffer {
        static LITTLE_ENDIAN: true;
        static BIG_ENDIAN: false;

        constructor(source: any, order?: boolean, implicitGrowth?: boolean): ByteBuffer;
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

    declare export default typeof ByteBuffer;
}
