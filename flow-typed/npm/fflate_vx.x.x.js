// flow-typed signature: 4fc6812065b3894c6a104452138e7a6b
// flow-typed version: <<STUB>>/fflate_v0.6.1/flow_v0.143.1
// This definition is partial and only declares as much as needed to have flow run successfully on this project.

declare module "fflate" {
    declare export type AsyncFlateStreamHandler = (err: Error, data: Uint8Array, final: boolean) => void;
    declare export type AsyncTerminable = () => void;
    declare export type UnzipFileHandler = (file: UnzipFile) => void;

    declare export interface UnzipDecoder {
        ondata: AsyncFlateStreamHandler;
        push(data: Uint8Array, final: boolean): void;
        terminate?: AsyncTerminable;
    }

    declare export class UnzipInflate implements UnzipDecoder {
        static compression: number;
        ondata: AsyncFlateStreamHandler;
        push(data: Uint8Array, final: boolean): void;
    }

    declare export interface UnzipFile {
        ondata: AsyncFlateStreamHandler;
        name: string;
        compression: number;
        size?: number;
        originalSize?: number;
        start(): void;
        terminate: AsyncTerminable;
    }

    declare export class Unzip {
        constructor(cb?: UnzipFileHandler): Unzip;
        push(chunk: Uint8Array, final: boolean): any;
        register(decoder: any): void;
        onfile: UnzipFileHandler;
    }

    declare export function decompressSync(data: Uint8Array, out?: Uint8Array): Uint8Array;
}

