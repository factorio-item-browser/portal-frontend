import {action, observable, runInAction} from "mobx";
import {createContext} from "react";

import Cache from "../class/Cache";
import {portalApi} from "../class/PortalApi";
import {routeFluidDetails, routeItemDetails} from "../helper/const";
import {routeStore} from "./RouteStore";
import {sidebarStore} from "./SidebarStore";

/**
 * The store for the items. And fluids.
 */
class ItemStore {
    /**
     * The cache of the item store.
     * @type {Cache<ItemDetailsData>}
     * @private
     */
    _cache;

    /**
     * The Portal API instance.
     * @type {PortalApi}
     * @private
     */
    _portalApi;

    /**
     * The route store.
     * @type {RouteStore}
     * @private
     */
    _routeStore;

    /**
     * The sidebar store.
     * @type {SidebarStore}
     * @private
     */
    _sidebarStore;

    /**
     * The current item details to be displayed.
     * @type {ItemDetailsData}
     */
    @observable
    currentItemDetails = {
        type: "",
        name: "",
        label: "",
        description: "",
        ingredientRecipes: [],
        ingredientRecipeCount: 0,
        productRecipes: [],
        productRecipeCount: 0,
    };

    /**
     * Initializes the store.
     * @param {Cache<ItemDetailsData>} cache
     * @param {PortalApi} portalApi
     * @param {RouteStore} routeStore
     * @param {SidebarStore} sidebarStore
     */
    constructor(cache, portalApi, routeStore, sidebarStore) {
        this._cache = cache;
        this._portalApi = portalApi;
        this._routeStore = routeStore;
        this._sidebarStore = sidebarStore;

        this._routeStore.addRouteListener(this._handleRouteChange.bind(this));
    }

    /**
     * Handles the change of the route.
     * @param {State} route
     * @private
     */
    async _handleRouteChange(route) {
        if (route.name === routeItemDetails) {
            await this.showItemDetails("item", route.params.name);
        } else if (route.name === routeFluidDetails) {
            await this.showItemDetails("fluid", route.params.name);
        }
    }

    /**
     * Shows the item details of the specified item or fluid.
     * @param {string} type
     * @param {string} name
     * @returns {Promise<void>}
     */
    @action
    async showItemDetails(type, name) {
        const data = await this._fetchData(type, name);
        runInAction(() => {
            this.currentItemDetails = data;
            this._sidebarStore.addViewedEntity(data.type, data.name, data.label);
            if (type === "fluid") {
                this._routeStore.navigateTo(routeFluidDetails, {name: data.name});
            } else {
                this._routeStore.navigateTo(routeItemDetails, {name: data.name});
            }
        });
    }

    /**
     * Fetches the data to display.
     * @param {string} type
     * @param {string} name
     * @returns {Promise<ItemDetailsData>}
     * @private
     */
    async _fetchData(type, name) {
        const cacheKey = `${type}-${name}`;
        const cachedData = this._cache.read(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._portalApi.requestItemDetails(type, name);
        this._cache.write(cacheKey, requestedData);
        return requestedData;
    }
}

const cache = new Cache("item", 86400000);

export const itemStore = new ItemStore(cache, portalApi, routeStore, sidebarStore);
export default createContext(itemStore);
