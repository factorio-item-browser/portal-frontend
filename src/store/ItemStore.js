import {createContext} from "react";
import Cache from "../class/Cache";
import {action, observable} from "mobx";
import {pageStore} from "./PageStore";
import {portalApi} from "../class/PortalApi";
import {routeFluidDetails, routeItemDetails} from "../helper/const";

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
     * The page store.
     * @type {PageStore}
     * @private
     */
    _pageStore;

    /**
     * The Portal API instance.
     * @type {PortalApi}
     * @private
     */
    _portalApi;

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
     * @param {PageStore} pageStore
     * @param {PortalApi} portalApi
     */
    constructor(cache, pageStore, portalApi) {
        this._cache = cache;
        this._pageStore = pageStore;
        this._portalApi = portalApi;

        this._pageStore.addRouteListener(this._handleRouteChange.bind(this));
    }

    /**
     * Handles the change of the route.
     * @param {State} route
     * @private
     */
    async _handleRouteChange(route) {
        if (route.name === routeItemDetails) {
            if (this.currentItemDetails.type !== "item" || this.currentItemDetails.name !== route.params.name) {
                await this.showItemDetails("item", route.params.name);
            }
        } else if (route.name === routeFluidDetails) {
            if (this.currentItemDetails.type !== "fluid" || this.currentItemDetails.name !== route.params.name) {
                await this.showItemDetails("fluid", route.params.name);
            }
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
        if (this.currentItemDetails.type === type && this.currentItemDetails.name === name) {
            return;
        }

        this.currentItemDetails = await this._fetchData(type, name);
        if (type === "fluid") {
            this._pageStore.navigateTo(routeFluidDetails, {name: name});
        } else {
            this._pageStore.navigateTo(routeItemDetails, {name: name});
        }
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

export const itemStore = new ItemStore(cache, pageStore, portalApi);
export default createContext(itemStore);
