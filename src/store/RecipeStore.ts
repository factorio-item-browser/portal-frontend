import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import { PaginatedList } from "../class/PaginatedList";
import { PortalApi, portalApi, PortalApiError } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { ROUTE_RECIPE_DETAILS } from "../const/route";
import { MachineData, RecipeDetailsData, RecipeMachinesData } from "../type/transfer";
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

export class RecipeStore {
    private readonly portalApi: PortalApi;
    private readonly routeStore: RouteStore;
    private readonly sidebarStore: SidebarStore;

    public currentRecipeDetails: RecipeDetailsData = emptyRecipeDetails;
    public paginatedMachinesList: PaginatedList<MachineData, RecipeMachinesData> | null = null;

    public constructor(portalApi: PortalApi, router: Router, routeStore: RouteStore, sidebarStore: SidebarStore) {
        this.portalApi = portalApi;
        this.routeStore = routeStore;
        this.sidebarStore = sidebarStore;

        makeObservable<this, "handlePortalApiError">(this, {
            handlePortalApiError: action,
            currentRecipeDetails: observable,
            hasNotFoundError: computed,
            paginatedMachinesList: observable,
        });

        router.addRoute(ROUTE_RECIPE_DETAILS, "/recipe/:name", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(state: State): Promise<void> {
        const { name } = state.params;

        const newMachinesList = new PaginatedList<MachineData, RecipeMachinesData>(
            (page) => this.portalApi.getRecipeMachines(name, page),
            (error) => this.handlePortalApiError(error),
        );

        try {
            const [recipeDetails] = await Promise.all([
                this.portalApi.getRecipeDetails(name),
                newMachinesList.requestNextPage(),
            ]);

            runInAction((): void => {
                this.currentRecipeDetails = recipeDetails;
                this.paginatedMachinesList = newMachinesList;

                this.sidebarStore.addViewedEntity("recipe", recipeDetails.name, recipeDetails.label);
            });
        } catch (e) {
            this.handlePortalApiError(e);
        }
    }

    private handlePortalApiError(error: PortalApiError): RecipeMachinesData {
        if (error.code === 404) {
            this.currentRecipeDetails = emptyRecipeDetails;
        } else {
            this.routeStore.handlePortalApiError(error);
        }
        return emptyRecipeMachinesData;
    }

    public get hasNotFoundError(): boolean {
        return this.currentRecipeDetails.name === "";
    }
}

export const recipeStore = new RecipeStore(portalApi, router, routeStore, sidebarStore);
export const recipeStoreContext = createContext<RecipeStore>(recipeStore);
