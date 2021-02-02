// @flow

import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import PaginatedList from "../class/PaginatedList";
import { PortalApi, portalApi, PortalApiError } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { ROUTE_RECIPE_DETAILS } from "../const/route";
import type { MachineData, RecipeDetailsData, RecipeMachinesData } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";
import { SidebarStore, sidebarStore } from "./SidebarStore";

const emptyRecipeDetails: RecipeDetailsData = {
    name: "",
    label: "",
    description: "",
};
const emptyRecipeMachinesData: RecipeMachinesData = {
    results: [],
    numberOfResults: 0,
};

/**
 * The store managing the recipes.
 */
export class RecipeStore {
    /** @private */
    _portalApi: PortalApi;
    /** @private */
    _routeStore: RouteStore;
    /** @private */
    _sidebarStore: SidebarStore;

    /**
     * The current recipe details to be displayed.
     */
    currentRecipeDetails: RecipeDetailsData = emptyRecipeDetails;

    /**
     * The paginated list of machines able to craft the current recipe.
     */
    paginatedMachinesList: PaginatedList<MachineData, RecipeMachinesData>;

    constructor(portalApi: PortalApi, router: Router, routeStore: RouteStore, sidebarStore: SidebarStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;
        this._sidebarStore = sidebarStore;

        makeObservable(this, {
            _handlePortalApiError: action,
            currentRecipeDetails: observable,
            hasNotFoundError: computed,
            paginatedMachinesList: observable,
        });

        router.addRoute(ROUTE_RECIPE_DETAILS, "/recipe/:name", this._handleRouteChange.bind(this));
    }

    /** @private */
    async _handleRouteChange(state: State): Promise<void> {
        const { name } = state.params;

        const newMachinesList = new PaginatedList(
            (page) => this._portalApi.getRecipeMachines(name, page),
            (error) => this._handlePortalApiError(error)
        );

        try {
            const [recipeDetails] = await Promise.all([
                this._portalApi.getRecipeDetails(name),
                newMachinesList.requestNextPage(),
            ]);

            runInAction((): void => {
                this.currentRecipeDetails = recipeDetails;
                this.paginatedMachinesList = newMachinesList;

                this._sidebarStore.addViewedEntity("recipe", recipeDetails.name, recipeDetails.label);
            });
        } catch (e) {
            this._handlePortalApiError(e);
        }
    }

    /** @private */
    _handlePortalApiError(error: PortalApiError): RecipeMachinesData {
        if (error.code === 404) {
            this.currentRecipeDetails = emptyRecipeDetails;
        } else {
            this._routeStore.handlePortalApiError(error);
        }
        return emptyRecipeMachinesData;
    }

    /**
     * Returns whether a not found error is present.
     */
    get hasNotFoundError(): boolean {
        return this.currentRecipeDetails.name === "";
    }
}

export const recipeStore = new RecipeStore(portalApi, router, routeStore, sidebarStore);
export const recipeStoreContext = createContext<RecipeStore>(recipeStore);
