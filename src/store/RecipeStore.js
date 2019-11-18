import {action, observable, runInAction} from "mobx";
import {createContext} from "react";

import Cache from "../class/Cache";
import {portalApi} from "../class/PortalApi";
import {routeRecipeDetails} from "../helper/const";
import {routeStore} from "./RouteStore";
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
     * The current recipe details to be displayed.
     * @type {RecipeDetailsData}
     */
    @observable
    currentRecipeDetails = {
        name: "",
        label: "",
        description: "",
    };

    /**
     * Initializes the store.
     * @param {Cache<RecipeDetailsData>} cache
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
        if (route.name === routeRecipeDetails) {
            await this.showRecipeDetails(route.params.name);
        }
    }

    /**
     * Shows the details of the recipe with the specified name.
     * @param {string} name
     * @returns {Promise<void>}
     */
    @action
    async showRecipeDetails(name) {
        const data = await this._fetchData(name);
        runInAction(() => {
            this.currentRecipeDetails = data;
            this._sidebarStore.addViewedEntity("recipe", data.name, data.label);
            this._routeStore.navigateTo(routeRecipeDetails, {name: data.name});
        });
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
}

const cache = new Cache('recipe', 86400000);

export const recipeStore = new RecipeStore(cache, portalApi, routeStore, sidebarStore);
export default createContext(recipeStore);
