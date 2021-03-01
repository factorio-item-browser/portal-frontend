export enum ErrorName {
    ClientFailure = "client-failure",
    PageNotFound = "page-not-found",
    ServerFailure = "server-failure",
    ServiceNotAvailable = "service-not-available",
}

export enum ErrorSeverity {
    Danger = "danger",
    Fatal = "fata",
    Warning = "warning",
}

export class PageError extends Error {
    public severity: ErrorSeverity = ErrorSeverity.Fatal;
}

export class ClientFailureError extends PageError {
    public constructor(message: string) {
        super(message);

        this.name = ErrorName.ClientFailure;
        this.severity = ErrorSeverity.Fatal;
    }
}

export class PageNotFoundError extends PageError {
    public constructor(message: string) {
        super(message);

        this.name = ErrorName.PageNotFound;
        this.severity = ErrorSeverity.Warning;
    }
}

export class RenderError extends ClientFailureError {}

export class ServerFailureError extends PageError {
    public constructor(message: string) {
        super(message);

        this.name = ErrorName.ServerFailure;
        this.severity = ErrorSeverity.Fatal;
    }
}

export class ServiceNotAvailableError extends PageError {
    public constructor(message: string) {
        super(message);

        this.name = ErrorName.ServiceNotAvailable;
        this.severity = ErrorSeverity.Danger;
    }
}
