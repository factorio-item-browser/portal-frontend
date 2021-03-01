export class SavegameError extends Error {}

export class InvalidFileError extends SavegameError {
    public constructor(message: string) {
        super(message);
        this.name = "invalid-file";
    }
}

export class UnsupportedVersionError extends SavegameError {
    public constructor(version: string) {
        super(version);
        this.name = "unsupported-version";
    }
}
