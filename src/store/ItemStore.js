import { observable, runInAction } from "mobx";
import { createContext } from "react";

import Cache from "../class/Cache";
import { portalApi } from "../class/PortalApi";
import PaginatedList from "../class/PaginatedList";
import { routeItemDetails } from "../helper/const";

import { routeStore } from "./RouteStore";
import { sidebarStore } from "./SidebarStore";

/**
 * The store for the items. And fluids.
 */
class ItemStore {
    /**
     * The cache of the item store.
     * @type {Cache<ItemRecipesData>}
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
     * The paginated list of product recipes.
     * @type {PaginatedList<ItemRecipesData,EntityData>}
     */
    @observable
    paginatedProductRecipesList;

    /**
     * The paginated list of ingredient recipes.
     * @type {PaginatedList<ItemRecipesData,EntityData>}
     */
    @observable
    paginatedIngredientRecipesList;

    /**
     * The current item details.
     * @type {{name: string, description: string, label: string, type: string}}
     */
    @observable
    currentItem = {
        type: "",
        name: "",
        label: "",
        description: "",
    };

    /**
     * Initializes the store.
     * @param {Cache<ItemRecipesData>} cache
     * @param {PortalApi} portalApi
     * @param {RouteStore} routeStore
     * @param {SidebarStore} sidebarStore
     */
    constructor(cache, portalApi, routeStore, sidebarStore) {
        this._cache = cache;
        this._portalApi = portalApi;
        this._routeStore = routeStore;
        this._sidebarStore = sidebarStore;

        this._routeStore.addRoute(routeItemDetails, "/:type<item|fluid>/:name", this._handleRouteChange.bind(this));
    }

    /**
     * Handles the change of the route.
     * @param {string} type
     * @param {string} name
     * @returns {Promise<void>}
     * @private
     */
    async _handleRouteChange({ type, name }) {
        const newProductsList = new PaginatedList((page) => this._fetchProductData(type, name, page));
        const newIngredientsList = new PaginatedList((page) => this._fetchIngredientData(type, name, page));

        const [productsData] = await Promise.all([
            newProductsList.requestNextPage(),
            newIngredientsList.requestNextPage(),
        ]);
        runInAction(() => {
            this.paginatedProductRecipesList = newProductsList;
            this.paginatedIngredientRecipesList = newIngredientsList;

            this.currentItem = {
                type: productsData.type,
                name: productsData.name,
                label: productsData.label,
                description: productsData.description,
            };

            this._sidebarStore.addViewedEntity(productsData.type, productsData.name, productsData.label);
        });
    }

    /**
     * Fetches the product recipes data from the API.
     * @param {string} type
     * @param {string} name
     * @param {number} page
     * @returns {Promise<ItemRecipesData>}
     * @private
     */
    async _fetchProductData(type, name, page) {
        const cacheKey = `${type}-${name}-products-${page}`;
        const cachedData = this._cache.read(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._portalApi.getItemProductRecipes(type, name, page);
        this._cache.write(cacheKey, requestedData);
        return requestedData;
    }

    /**
     * Fetches the ingredient recipes data from the API.
     * @param {string} type
     * @param {string} name
     * @param {number} page
     * @returns {Promise<ItemRecipesData>}
     * @private
     */
    async _fetchIngredientData(type, name, page) {
        const cacheKey = `${type}-${name}-ingredients-${page}`;
        const cachedData = this._cache.read(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._portalApi.getItemIngredientRecipes(type, name, page);
        this._cache.write(cacheKey, requestedData);
        return requestedData;
    }
}

const cache = new Cache("item", 86400000);

export const itemStore = new ItemStore(cache, portalApi, routeStore, sidebarStore);
export default createContext(itemStore);
