import {computed, observable} from "mobx";
import {createContext} from "react";
import {createRouter} from "router5";
import browserPluginFactory from "router5-plugin-browser";

import {routeFluidDetails, routeIndex, routeItemDetails, routeSearch} from "../helper/const";

/**
 * The configuration of the routes.
 * @type {Route[]}
 */
const routeConfig = [
    {
        name: routeIndex,
        path: "/",
    },
    {
        name: routeFluidDetails,
        path: "/fluid/:name",
    },
    {
        name: routeItemDetails,
        path: "/item/:name",
    },
    {
        name: routeSearch,
        path: "/search/*query",
    }
];

/**
 * The store handling the pages, including routing between them.
 */
class PageStore {
    /**
     * The router of the page store.
     * @type {Router}
     */
    _router;

    /**
     * The change handlers for the router.
     * @type {Function[]|SubscribeFn[]}
     * @private
     */
    _routeListeners = [];

    /**
     * The current page which is displayed.
     * @type {string}
     */
    @observable
    currentPage = routeIndex;

    /**
     * The portal API instance.
     * @param {Route[]} routeConfig
     */
    constructor(routeConfig) {
        this._router = this._createRouter(routeConfig);
        this._router.start();
    }

    /**
     * Creates the router to use.
     * @param {Route[]} routeConfig
     * @returns {Router}
     * @private
     */
    _createRouter(routeConfig) {
        const router = createRouter(routeConfig);
        router.usePlugin(browserPluginFactory());
        router.subscribe(this._handleChangeEvent.bind(this));
        return router;
    }

    /**
     * Handles the change event of the router.
     * @param {SubscribeState} state
     * @private
     */
    _handleChangeEvent(state) {
        this._routeListeners.forEach((handler) => {
            handler(state.route, state.previousRoute);
        });
        this.currentPage = state.route.name;
    }

    /**
     * Adds a listener which gets triggered whenever the route changes.
     * @param {Function|SubscribeFn} callback
     */
    addRouteListener(callback) {
        this._routeListeners.push(callback);
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
     * Whether to use the big version of the header.
     * @returns {boolean}
     */
    @computed
    get useBigHeader() {
        return this.currentPage === routeIndex;
    }
}

export const pageStore = new PageStore(routeConfig);
export default createContext(pageStore);
