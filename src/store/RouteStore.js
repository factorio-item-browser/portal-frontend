import { action, computed, observable } from "mobx";
import { createContext } from "react";
import { createRouter } from "router5";
import browserPluginFactory from "router5-plugin-browser";

import { portalApi } from "../class/PortalApi";
import { routeIndex, routeItemDetails, routeRecipeDetails } from "../helper/const";

/**
 * The map from the entity types to their corresponding routes.
 * @type {Object<string, string>}
 */
const entityTypeToRouteMap = {
    item: routeItemDetails,
    fluid: routeItemDetails,
    recipe: routeRecipeDetails,
};

/**
 * The store handling the pages, including routing between them.
 */
class RouteStore {
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
     * The portal API instance.
     */
    constructor() {
        this._router = this._createRouter();
        this.addRoute(routeIndex, "/");
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
    }

    /**
     * Adds a route to be handled.
     * @param {string} name
     * @param {string} path
     * @param {Function} [changeHandler]
     */
    addRoute(name, path, changeHandler) {
        console.log(`ADD ROUTE ${name}`);

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
     * Initializes the session.
     * @returns {Promise<void>}
     */
    async initializeSession() {
        console.log("Initialize Session");

        const session = await portalApi.initializeSession();
        console.log("Initialize Session COMPLETE, running handlers.");
        this._initializeSessionHandlers.forEach((handler) => {
            handler(session);
        });
        console.log("Starting router");
        this._router.start();
    }

    /**
     * Navigates to the specified route.
     * @param {string} route
     * @param {Object} [params]
     */
    navigateTo(route, params) {
        this._router.navigate(route, params);
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
            route: routeIndex,
            params: {},
        };
    }

    /**
     * Whether to use the big version of the header.
     * @returns {boolean}
     */
    @computed
    get useBigHeader() {
        return this.currentRoute === routeIndex;
    }
}

export const routeStore = new RouteStore();
export default createContext(routeStore);
