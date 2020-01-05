import { action, computed, observable } from "mobx";
import { createContext } from "react";
import { createRouter } from "router5";
import browserPluginFactory from "router5-plugin-browser";

import { routeFluidDetails, routeIndex, routeItemDetails, routeRecipeDetails, routeSearch } from "../helper/const";
import { itemStore } from "./ItemStore";
import { recipeStore } from "./RecipeStore";
import { searchStore } from "./SearchStore";

/**
 * The configuration of the routes.
 * @type {Route[]}
 */
const routes = [
    {
        name: routeIndex,
        path: "/",
    },
    {
        name: routeItemDetails,
        path: "/item/:name",
        handleChange: (routeStore, params) => {
            return routeStore._itemStore.handleRouteChange("item", params.name);
        },
    },
    {
        name: routeFluidDetails,
        path: "/fluid/:name",
        handleChange: (routeStore, params) => {
            return routeStore._itemStore.handleRouteChange("fluid", params.name);
        },
    },
    {
        name: routeRecipeDetails,
        path: "/recipe/:name",
        handleChange: (routeStore, params) => {
            return routeStore._recipeStore.handleRouteChange(params.name);
        },
    },
    {
        name: routeSearch,
        path: "/search/*query",
        handleChange: (routeStore, params) => {
            return routeStore._searchStore.handleRouteChange(params.query);
        },
    },
];

/**
 * The map from the entity types to their corresponding routes.
 * @type {Object<string, string>}
 */
const entityTypeToRouteMap = {
    item: routeItemDetails,
    fluid: routeFluidDetails,
    recipe: routeRecipeDetails,
};

/**
 * The store handling the pages, including routing between them.
 */
class RouteStore {
    /**
     * The item store.
     * @type {ItemStore}
     * @private
     */
    _itemStore;

    /**
     * The recipe store.
     * @type {RecipeStore}
     * @private
     */
    _recipeStore;

    /**
     * The search store.
     * @type {SearchStore}
     * @private
     */
    _searchStore;

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
     * @param {Route[]} routes
     * @param {ItemStore} itemStore
     * @param {RecipeStore} recipeStore
     * @param {SearchStore} searchStore
     */
    constructor(routes, itemStore, recipeStore, searchStore) {
        this._itemStore = itemStore;
        this._recipeStore = recipeStore;
        this._searchStore = searchStore;
        this._searchStore.injectRouteStore(this);

        this._router = this._createRouter(routes);
        this._router.start();
    }

    /**
     * Creates the router to use.
     * @param {Route[]} routes
     * @returns {Router}
     * @private
     */
    _createRouter(routes) {
        const router = createRouter(routes);
        router.usePlugin(browserPluginFactory());
        router.useMiddleware(this._getFetchDataHandlerMiddleware(routes).bind(this));
        router.subscribe(this._handleChangeEvent.bind(this));
        return router;
    }

    /**
     * The middleware for handling the route changes.
     * @param {Route[]} routes
     * @returns {function(): function(State): boolean | Promise<any>}
     * @private
     */
    _getFetchDataHandlerMiddleware(routes) {
        return () => (toState) => {
            let result = true;
            routes.forEach((route) => {
                if (route.name === toState.name && route.handleChange) {
                    result = route.handleChange(this, toState.params);
                }
            });
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
                params: { name: name },
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

export const routeStore = new RouteStore(routes, itemStore, recipeStore, searchStore);
export default createContext(routeStore);
