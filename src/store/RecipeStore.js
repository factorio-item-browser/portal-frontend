import {action, observable} from "mobx";
import {createContext} from "react";

import Cache from "../class/Cache";
import {portalApi} from "../class/PortalApi";
import {sidebarStore} from "./SidebarStore";

/**
 * The store managing the recipes.
 */
class RecipeStore {
    /**
     * The cache of the recipe details.
     * @type {Cache<RecipeDetailsData>}
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
     * The current recipe details to be displayed.
     * @type {RecipeDetailsData}
     */
    @observable
    currentRecipeDetails = {
        name: "",
        label: "",
        description: "",
        machines: [],
    };

    /**
     * Initializes the store.
     * @param {Cache<RecipeDetailsData>} cache
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
     * @param {string} name
     * @returns {Promise<RecipeDetailsData>}
     */
    async handleRouteChange(name) {
        return this._fetchData(name).then(this._applyRecipeDetails.bind(this));
    }

    /**
     * Fetches the recipe data to display.
     * @param {string} name
     * @returns {Promise<RecipeDetailsData>}
     * @private
     */
    async _fetchData(name) {
        const cachedData = this._cache.read(name);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._portalApi.requestRecipeDetails(name);
        this._cache.write(name, requestedData);
        return requestedData;
    }

    /**
     * Applies the recipe details to the store.
     * @param {RecipeDetailsData} recipeDetails
     * @private
     */
    @action
    _applyRecipeDetails(recipeDetails) {
        this.currentRecipeDetails = recipeDetails;
        this._sidebarStore.addViewedEntity("recipe", recipeDetails.name, recipeDetails.label);
    }

}

const cache = new Cache('recipe', 86400000);

export const recipeStore = new RecipeStore(cache, portalApi, sidebarStore);
export default createContext(recipeStore);
