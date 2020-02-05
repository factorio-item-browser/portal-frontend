import { observable, runInAction } from "mobx";
import { createContext } from "react";

import Cache from "../class/Cache";
import { portalApi } from "../class/PortalApi";
import PaginatedList from "../class/PaginatedList";
import { routeRecipeDetails } from "../helper/const";

import { routeStore } from "./RouteStore";
import { sidebarStore } from "./SidebarStore";

/**
 * The store managing the recipes.
 */
class RecipeStore {
    /**
     * The cache of the recipe details.
     * @type {Cache<RecipeDetailsData>}
     * @private
     */
    _detailsCache;

    /**
     * The cache of the recipe machines.
     * @type {Cache<RecipeMachinesData>}
     * @private
     */
    _machinesCache;

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
        recipe: null,
        expensiveRecipe: null,
    };

    /**
     * The paginated list of machines able to craft the current recipe.
     * @type PaginatedList<RecipeMachinesData,MachineData>
     */
    @observable
    paginatedMachinesList;

    /**
     * Initializes the store.
     * @param {Cache<RecipeDetailsData>} detailsCache
     * @param {Cache<RecipeMachinesData>} machinesCache
     * @param {PortalApi} portalApi
     * @param {RouteStore} routeStore
     * @param {SidebarStore} sidebarStore
     */
    constructor(detailsCache, machinesCache, portalApi, routeStore, sidebarStore) {
        this._detailsCache = detailsCache;
        this._machinesCache = machinesCache;
        this._portalApi = portalApi;
        this._routeStore = routeStore;
        this._sidebarStore = sidebarStore;

        this._initializeRoutes();
    }

    /**
     * Initializes the routes of the store.
     * @private
     */
    _initializeRoutes() {
        this._routeStore.addRoute(routeRecipeDetails, "/recipe/:name", this._handleRouteChange.bind(this));
    }

    /**
     * Handles the change of the route.
     * @param {string} name
     * @returns {Promise<void>}
     * @private
     */
    async _handleRouteChange({ name }) {
        const newMachinesList = new PaginatedList((page) => this._fetchMachinesData(name, page));
        const [recipeDetails] = await Promise.all([this._fetchDetailsData(name), newMachinesList.requestNextPage()]);

        runInAction(() => {
            this.currentRecipeDetails = recipeDetails;
            this.paginatedMachinesList = newMachinesList;

            this._sidebarStore.addViewedEntity("recipe", recipeDetails.name, recipeDetails.label);
        });
    }

    /**
     * Fetches the recipe data to display.
     * @param {string} name
     * @returns {Promise<RecipeDetailsData>}
     * @private
     */
    async _fetchDetailsData(name) {
        const cacheKey = name;
        const cachedData = this._detailsCache.read(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._portalApi.getRecipeDetails(name);
        this._detailsCache.write(cacheKey, requestedData);
        return requestedData;
    }

    /**
     * Fetches the machines able to craft the recipe.
     * @param {string} name
     * @param {number} page
     * @returns {Promise<RecipeMachinesData>}
     * @private
     */
    async _fetchMachinesData(name, page) {
        const cacheKey = `${name}-${page}`;
        const cachedData = this._machinesCache.read(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._portalApi.getRecipeMachines(name, page);
        this._machinesCache.write(cacheKey, requestedData);
        return requestedData;
    }
}

const detailsCache = new Cache("recipe", 86400000);
const machinesCache = new Cache("recipe-machines", 86400000);

export const recipeStore = new RecipeStore(detailsCache, machinesCache, portalApi, routeStore, sidebarStore);
export default createContext(recipeStore);
