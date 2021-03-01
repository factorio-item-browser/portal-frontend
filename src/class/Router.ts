import { createRouter, Middleware, Router as Router5, State, SubscribeState } from "router5";
import browserPluginFactory from "router5-plugin-browser";
import { ROUTE_INDEX } from "../const/route";
import { PageError } from "../error/error";
import { CombinationId } from "./CombinationId";

type ChangeHandler = (state: State) => void | Promise<void>;
type ErrorHandler = (error: PageError) => void;
export type RouteParams = { [key: string]: string };

const PARAM_COMBINATION_ID = "combinationId";
const SHORT_ROUTE_SUFFIX = "_short";

export class Router {
    private readonly router: Router5;
    private readonly changeHandlers = new Map<string, ChangeHandler>();
    private readonly globalChangeHandlers = new Set<ChangeHandler>();
    private combinationId: CombinationId | null = null;
    private currentState: State | null = null;
    private errorHandler: ErrorHandler | null = null;

    public constructor() {
        this.router = this.createRouter();
    }

    private createRouter(): Router5 {
        const router = createRouter();
        router.setOption("allowNotFound", true);
        router.usePlugin(browserPluginFactory());
        router.useMiddleware(this.getDataFetcherMiddleware.bind(this));
        router.subscribe(this.handleChangeEvent.bind(this));
        return router;
    }

    /**
     * Injects the callback to handle errors by forwarding it.
     */
    public injectErrorHandler(errorHandler: ErrorHandler): void {
        this.errorHandler = errorHandler;
    }

    private getDataFetcherMiddleware(): Middleware {
        return (toState: State) => {
            const handler = this.changeHandlers.get(this.unifyRouteName(toState.name));
            if (handler) {
                return handler(toState);
            }

            return true;
        };
    }

    private handleChangeEvent(state: SubscribeState): void {
        this.currentState = state.route;
        this.executeGlobalChangeHandlers(state.route);
    }

    private unifyRouteName(name: string): string {
        if (name.endsWith(SHORT_ROUTE_SUFFIX)) {
            return name.substr(0, name.length - SHORT_ROUTE_SUFFIX.length);
        }

        return name;
    }

    private executeGlobalChangeHandlers(state: State): void {
        for (const handler of this.globalChangeHandlers) {
            handler(state);
        }
    }

    public start(combinationId: CombinationId): void {
        this.combinationId = combinationId;
        this.router.start((err?: unknown, state?: State): void => {
            if (state && state.name.endsWith(SHORT_ROUTE_SUFFIX)) {
                this.navigateTo(this.unifyRouteName(state.name), state.params);
            }
        });
    }

    public get currentRoute(): string {
        if (!this.currentState) {
            return ROUTE_INDEX;
        }

        return this.unifyRouteName(this.currentState.name);
    }

    public addGlobalChangeHandler(handler: ChangeHandler): void {
        this.globalChangeHandlers.add(handler);
    }

    public addRoute(name: string, path: string, changeHandler?: ChangeHandler): void {
        this.router.add([
            {
                name: name,
                path: `/:${PARAM_COMBINATION_ID}${path}`,
            },
            {
                name: name + SHORT_ROUTE_SUFFIX,
                path: path,
            },
        ]);

        if (changeHandler) {
            this.changeHandlers.set(name, changeHandler);
        }
    }

    public isActive(route: string, params?: RouteParams): boolean {
        return (
            this.router.isActive(route, this.prepareParams(params)) ||
            this.router.isActive(route + SHORT_ROUTE_SUFFIX, params)
        );
    }

    public navigateTo(route: string, params?: RouteParams): void {
        this.router.navigate(route, this.prepareParams(params));
    }

    public buildPath(route: string, params?: RouteParams): string {
        return this.router.buildPath(route, this.prepareParams(params));
    }

    public redirectToIndex(combinationId?: CombinationId): void {
        if (combinationId) {
            location.assign(this.buildPath(ROUTE_INDEX, { [PARAM_COMBINATION_ID]: combinationId.toShort() }));
        } else {
            location.assign(this.buildPath(ROUTE_INDEX + SHORT_ROUTE_SUFFIX));
        }
    }

    private prepareParams(params?: RouteParams): RouteParams {
        params = params || {};
        if (this.combinationId && !params[PARAM_COMBINATION_ID]) {
            params[PARAM_COMBINATION_ID] = this.combinationId.toShort();
        }
        return params;
    }

    /**
     * Handles the error, forwarding it to the error store to trigger an error page.
     */
    public handleError(error: PageError): void {
        if (this.errorHandler) {
            this.errorHandler(error);
        }
    }
}

export const router: Router = new Router();
