import {action, observable} from "mobx";
import {createContext} from "react";

import Cache from "../class/Cache";
import {portalApi} from "../class/PortalApi";
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
     * @param {SidebarStore} sidebarStore
     */
    constructor(cache, portalApi, sidebarStore) {
        this._cache = cache;
        this._portalApi = portalApi;
        this._sidebarStore = sidebarStore;
    }

    /**
     * Handles the change of the route.
     * @param {string} type
     * @param {string} name
     * @returns {Promise<ItemDetailsData>}
     */
    async handleRouteChange(type, name) {
        return this._fetchData(type, name).then(this._applyItemDetails.bind(this));
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

        return this._portalApi.requestItemDetails(type, name).then((itemDetails) => {
            this._cache.write(cacheKey, itemDetails);
            return itemDetails;
        });
    }

    /**
     * Updates the received item details.
     * @param {ItemDetailsData} itemDetails
     * @private
     */
    @action
    _applyItemDetails(itemDetails) {
        this.currentItemDetails = itemDetails;
        this._sidebarStore.addViewedEntity(itemDetails.type, itemDetails.name, itemDetails.label);
    }
}

const cache = new Cache("item", 86400000);

export const itemStore = new ItemStore(cache, portalApi, sidebarStore);
export default createContext(itemStore);
