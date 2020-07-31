import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";

import { portalApi } from "../class/PortalApi";
import PaginatedList from "../class/PaginatedList";
import { ROUTE_RECIPE_DETAILS } from "../const/route";

import { routeStore } from "./RouteStore";
import { sidebarStore } from "./SidebarStore";

/**
 * The store managing the recipes.
 */
class RecipeStore {
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
     * @param {PortalApi} portalApi
     * @param {RouteStore} routeStore
     * @param {SidebarStore} sidebarStore
     */
    constructor(portalApi, routeStore, sidebarStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;
        this._sidebarStore = sidebarStore;

        this._routeStore.addRoute(ROUTE_RECIPE_DETAILS, "/recipe/:name", this._handleRouteChange.bind(this));
    }

    /**
     * Handles the change of the route.
     * @param {string} name
     * @returns {Promise<void>}
     * @private
     */
    async _handleRouteChange({ name }) {
        const newMachinesList = new PaginatedList(
            (page) => this._portalApi.getRecipeMachines(name, page),
            (error) => this._handlePortalApiError(error)
        );

        try {
            const [recipeDetails] = await Promise.all([
                this._portalApi.getRecipeDetails(name),
                newMachinesList.requestNextPage(),
            ]);

            runInAction(() => {
                this.currentRecipeDetails = recipeDetails;
                this.paginatedMachinesList = newMachinesList;

                this._sidebarStore.addViewedEntity("recipe", recipeDetails.name, recipeDetails.label);
            });
        } catch (e) {
            this._handlePortalApiError(e);
        }
    }

    /**
     * Handles the Portal API error.
     * @param {PortalApiError} error
     * @private
     */
    @action
    _handlePortalApiError(error) {
        if (error.code === 404) {
            this.currentRecipeDetails = {
                name: "",
                label: "",
                description: "",
                recipe: null,
                expensiveRecipe: null,
            };
        } else {
            this._routeStore.handlePortalApiError(error);
        }
    }

    /**
     * Returns whether a not found error is present.
     * @return {boolean}
     */
    @computed
    get hasNotFoundError() {
        return this.currentRecipeDetails.name === "";
    }
}

export const recipeStore = new RecipeStore(portalApi, routeStore, sidebarStore);
export default createContext(recipeStore);
