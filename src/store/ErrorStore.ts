import { action, computed, makeObservable, observable } from "mobx";
import { createContext } from "react";
import { constants, State } from "router5";
import { router, Router } from "../class/Router";
import { PageError, PageNotFoundError } from "../error/error";
import { ErrorSeverity } from "../error/severity";

export class ErrorStore {
    /** The error which is currently present. */
    public error: PageError | null = null;

    public constructor(router: Router) {
        makeObservable<this, "handleGlobalRouteChange">(this, {
            error: observable,
            handleError: action,
            handleGlobalRouteChange: action,
            isFatalError: computed,
        });

        router.addGlobalChangeHandler(this.handleGlobalRouteChange.bind(this));
        router.injectErrorHandler(this.handleError.bind(this));
    }

    private handleGlobalRouteChange(state: State): void {
        if (state.name === constants.UNKNOWN_ROUTE) {
            this.error = new PageNotFoundError(`unknown path: ${state.path}`);
            console.error(this.error);
        } else if (this.error !== null) {
            this.error = null;
        }
    }

    /**
     * Whether the error is considered fatal and must replace the whole page.
     */
    public get isFatalError(): boolean {
        return this.error !== null && this.error.severity !== ErrorSeverity.Warning;
    }

    /**
     * Handles the specified error, triggering the error page.
     */
    public handleError(error: PageError): void {
        this.error = error;
        console.error(this.error);
    }

    /**
     * Creates an error handler to be used with a paginated list.
     * @param emptyData The empty data to return in case of an error.
     */
    public createPaginatesListErrorHandler<T>(emptyData: T): (error: PageError) => T {
        return (error) => {
            this.handleError(error);
            return emptyData;
        };
    }
}

export const errorStore = new ErrorStore(router);
export const errorStoreContext = createContext(errorStore);
