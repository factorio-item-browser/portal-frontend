// @flow

import { createRouter, Middleware, Params, Router as Router5, State, SubscribeState } from "router5";
import browserPluginFactory from "router5-plugin-browser";
import { ROUTE_INDEX, ROUTE_ITEM_DETAILS, ROUTE_RECIPE_DETAILS } from "../const/route";
import CombinationId from "./CombinationId";

type ChangeHandler = (State) => boolean | Promise<any>;

const MAP_ENTITY_TYPE_TO_ROUTE = {
    item: ROUTE_ITEM_DETAILS,
    fluid: ROUTE_ITEM_DETAILS,
    recipe: ROUTE_RECIPE_DETAILS,
};
const PARAM_COMBINATION_ID = "combination-id";
const SHORT_ROUTE_SUFFIX = "-short";

export class Router {
    /**
     * @private
     */
    _router: Router5;

    /**
     * @private
     */
    _changeHandlers: Map<string, ChangeHandler> = new Map();

    /**
     * @private
     */
    _globalChangeHandlers: Set<ChangeHandler> = new Set();

    /**
     * @private
     */
    _combinationId: CombinationId;

    /**
     * @private
     */
    _currentRoute = "";

    constructor() {
        this._router = this._createRouter();
    }

    /**
     * @private
     */
    _createRouter(): Router5 {
        const router = createRouter();
        router.setOption("allowNotFound", true);
        router.usePlugin(browserPluginFactory());
        router.useMiddleware(this._getDataFetcherMiddleware.bind(this));
        router.subscribe(this._handleChangeEvent.bind(this));
        return router;
    }

    /**
     * @private
     */
    _getDataFetcherMiddleware(): Middleware {
        return (toState: State) => {
            const handler = this._changeHandlers.get(this._unifyRouteName(toState.name));
            if (handler) {
                return handler(toState);
            }

            return true;
        };
    }

    /**
     * @private
     */
    _handleChangeEvent(state: SubscribeState): void {
        this._currentRoute = this._unifyRouteName(state.route.name);
        this._executeGlobalChangeHandlers(state.route);
    }

    /**
     * @private
     */
    _unifyRouteName(name: string): string {
        if (name.endsWith(SHORT_ROUTE_SUFFIX)) {
            return name.substr(0, name.length - SHORT_ROUTE_SUFFIX.length);
        }

        return name;
    }

    _executeGlobalChangeHandlers(state: State): void {
        for (const handler of this._globalChangeHandlers) {
            handler(state);
        }
    }

    start(combinationId: CombinationId): void {
        this._combinationId = combinationId;
        this._router.start();
    }

    get currentRoute(): string {
        return this._currentRoute;
    }

    addGlobalChangeHandler(handler: ChangeHandler): void {
        this._globalChangeHandlers.add(handler);
    }

    addRoute(name: string, path: string, changeHandler?: ChangeHandler): void {
        this._router.add([
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
            this._changeHandlers.set(name, changeHandler);
        }
    }

    isActive(route: string, params?: Params): boolean {
        return (
            this._router.isActive(route, this._prepareParams(params)) ||
            this._router.isActive(route + SHORT_ROUTE_SUFFIX, params)
        );
    }

    navigateTo(route: string, params?: Params): void {
        this._router.navigate(route, this._prepareParams(params));
    }

    buildPath(route: string, params?: Params): string {
        return this._router.buildPath(route, this._prepareParams(params));
    }

    /**
     * Redirects to the index page, to e.g. apply a new setting. This is a hard refresh of the page.
     */
    redirectToIndex(combinationId?: CombinationId): void {
        if (combinationId) {
            location.assign(this.buildPath(ROUTE_INDEX, { [PARAM_COMBINATION_ID]: combinationId.toShort() }));
        } else {
            location.assign(this.buildPath(ROUTE_INDEX + SHORT_ROUTE_SUFFIX));
        }
    }

    /**
     * @private
     */
    _prepareParams(params: Params): Params {
        if (this._combinationId) {
            params = {
                [PARAM_COMBINATION_ID]: this._combinationId.toShort(),
                ...params,
            };
        }
        return params;
    }

    /**
     * Returns the route and params used to link to the entity.
     */
    getRouteAndParamsForEntity(type: string, name: string): { route: string, params: Params } {
        const route = MAP_ENTITY_TYPE_TO_ROUTE[type];
        if (route) {
            return {
                route: route,
                params: { type, name },
            };
        }

        return {
            route: ROUTE_INDEX,
            params: {},
        };
    }
}

export const router = new Router();