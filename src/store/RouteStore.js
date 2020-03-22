import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";
import { createRouter } from "router5";
import browserPluginFactory from "router5-plugin-browser";

import { cacheManager } from "../class/CacheManager";
import { portalApi } from "../class/PortalApi";
import { ROUTE_INDEX, ROUTE_ITEM_DETAILS, ROUTE_RECIPE_DETAILS } from "../helper/const";

/**
 * The map from the entity types to their corresponding routes.
 * @type {Object<string, string>}
 */
const entityTypeToRouteMap = {
    item: ROUTE_ITEM_DETAILS,
    fluid: ROUTE_ITEM_DETAILS,
    recipe: ROUTE_RECIPE_DETAILS,
};

/**
 * The store handling the pages, including routing between them.
 */
class RouteStore {
    /**
     * The cache manager.
     * @type {CacheManager}
     * @private
     */
    _cacheManager;

    /**
     * The portal API instance.
     * @type {PortalApi}
     * @private
     */
    _portalApi;

    /**
     * The change handlers of the routes.
     * @type {object<string,Function>}
     * @private
     */
    _changeHandlers = {};

    /**
     * The handlers for initialising the session.
     * @type {(function(SessionInitData): void)[]}
     * @private
     */
    _initializeSessionHandlers = [];

    /**
     * The handlers called on every route change.
     * @type {function[]}
     * @private
     */
    _routeChangeHandlers = [];

    /**
     * The router of the store.
     * @type {Router}
     */
    _router;

    /**
     * The current route which is displayed.
     * @type {string}
     */
    @observable
    currentRoute = "";

    /**
     * The target which currently have the loading circle.
     * @type {React.RefObject<HTMLElement>}
     */
    @observable
    loadingCircleTarget = null;

    /**
     * The name of the currently loaded setting.
     * @type {string}
     */
    @observable
    settingName = "Vanilla";

    /**
     * The locale to use for the page.
     * @type {string}
     */
    @observable
    locale = "en";

    /**
     * Initializes the route store.
     * @param {CacheManager} cacheManager
     * @param {PortalApi} portalApi
     */
    constructor(cacheManager, portalApi) {
        this._cacheManager = cacheManager;
        this._portalApi = portalApi;

        this._router = this._createRouter();
        this.addInitializeSessionHandler(this._initializeSession.bind(this));
    }

    /**
     * Creates the router to use.
     * @returns {Router}
     * @private
     */
    _createRouter() {
        const router = createRouter();
        router.usePlugin(browserPluginFactory());
        router.useMiddleware(this._getFetchDataHandlerMiddleware.bind(this));
        router.subscribe(this._handleChangeEvent.bind(this));
        return router;
    }

    /**
     * The middleware for handling the route changes.
     * @returns {function(State): boolean | Promise<any>}
     * @private
     */
    _getFetchDataHandlerMiddleware() {
        return (toState) => {
            let result = true;
            if (this._changeHandlers[toState.name]) {
                result = this._changeHandlers[toState.name](toState.params);
            }
            return result;
        };
    }

    /**
     * Handles the change event of the router.
     * @param {SubscribeState} state
     * @private
     */
    @action
    _handleChangeEvent(state) {
        this.currentRoute = state.route.name;

        for (const handler of this._routeChangeHandlers) {
            handler(state);
        }
    }

    /**
     * Initializes the session
     * @param {SessionInitData} session
     * @private
     */
    @action
    _initializeSession(session) {
        this.settingName = session.settingName;
        this.locale = session.locale;

        this._cacheManager.setSettingHash(session.settingHash);
    }

    /**
     * Adds a route to be handled.
     * @param {string} name
     * @param {string} path
     * @param {Function} [changeHandler]
     */
    addRoute(name, path, changeHandler) {
        this._router.add([{ name, path }]);

        if (changeHandler) {
            this._changeHandlers[name] = changeHandler;
        }
    }

    /**
     * Adds a handler for initializing the session.
     * @param {function(SessionInitData): void} handler
     */
    addInitializeSessionHandler(handler) {
        this._initializeSessionHandlers.push(handler);
    }

    /**
     * Adds a handler called on every route change.
     * @param {function} handler
     */
    addRouteChangeHandler(handler) {
        this._routeChangeHandlers.push(handler);
    }

    /**
     * Whether we are still initially loading all the things.
     * @return {boolean}
     */
    @computed
    get isInitiallyLoading() {
        return this.currentRoute === "";
    }

    /**
     * Initializes the session.
     * @returns {Promise<void>}
     */
    async initializeSession() {
        const session = await portalApi.initializeSession();
        this._initializeSessionHandlers.forEach((handler) => {
            handler(session);
        });
        this._router.start();
    }

    /**
     * Navigates to the specified route.
     * @param {string} route
     * @param {Object} [params]
     */
    navigateTo(route, params) {
        this._router.navigate(route, params, () => {
            runInAction(() => {
                this.loadingCircleTarget = null;
            });
        });
    }

    /**
     * Builds the path to the specified route.
     * @param {string} route
     * @param {Object} [params]
     * @returns {string}
     */
    buildPath(route, params) {
        return this._router.buildPath(route, params);
    }

    /**
     * Returns the route and params used to link to the entity.
     * @param {string} type
     * @param {string} name
     * @returns {{route: string, params: Object<string,any>}}
     */
    getRouteAndParamsForEntity(type, name) {
        const route = entityTypeToRouteMap[type];
        if (route) {
            return {
                route: route,
                params: { type: type, name: name },
            };
        }

        return {
            route: ROUTE_INDEX,
            params: {},
        };
    }

    /**
     * Whether to use the big version of the header.
     * @returns {boolean}
     */
    @computed
    get useBigHeader() {
        return this.currentRoute === ROUTE_INDEX;
    }

    /**
     * Shows the loading circle overlaying the passed reference object.
     * @param {React.RefObject<HTMLElement>} ref
     */
    @action
    showLoadingCircle(ref) {
        this.loadingCircleTarget = ref;
    }
}

export const routeStore = new RouteStore(cacheManager, portalApi);
export default createContext(routeStore);
