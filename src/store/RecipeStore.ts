import { action, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import { PaginatedList } from "../class/PaginatedList";
import { portalApi, PortalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { Route } from "../const/route";
import { MachineData, RecipeDetailsData, RecipeMachinesData } from "../type/transfer";
import { errorStore, ErrorStore } from "./ErrorStore";
import { sidebarStore, SidebarStore } from "./SidebarStore";

const emptyRecipeDetails: RecipeDetailsData = {
    name: "",
    label: "",
    description: "",
};
const emptyRecipeMachines: RecipeMachinesData = {
    results: [],
    numberOfResults: 0,
};

export class RecipeStore {
    private readonly errorStore: ErrorStore;
    private readonly portalApi: PortalApi;
    private readonly sidebarStore: SidebarStore;

    /** The recipe details to be shown. */
    public recipeDetails: RecipeDetailsData = emptyRecipeDetails;
    /** The paginated list of machines to show. */
    public paginatedMachinesList: PaginatedList<MachineData, RecipeMachinesData> | null = null;

    public constructor(errorStore: ErrorStore, portalApi: PortalApi, router: Router, sidebarStore: SidebarStore) {
        this.errorStore = errorStore;
        this.portalApi = portalApi;
        this.sidebarStore = sidebarStore;

        makeObservable<this, "handleRouteChange">(this, {
            recipeDetails: observable,
            paginatedMachinesList: observable,
            handleRouteChange: action,
        });

        router.addRoute(Route.RecipeDetails, "/recipe/:name", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(state: State): Promise<void> {
        const { name } = state.params;

        const newMachinesList = new PaginatedList<MachineData, RecipeMachinesData>(
            (page) => this.portalApi.getRecipeMachines(name, page),
            this.errorStore.createPaginatesListErrorHandler(emptyRecipeMachines),
        );

        try {
            const [recipeDetails] = await Promise.all([
                this.portalApi.getRecipeDetails(name),
                newMachinesList.requestNextPage(),
            ]);

            runInAction((): void => {
                this.recipeDetails = recipeDetails;
                this.paginatedMachinesList = newMachinesList;

                this.sidebarStore.addViewedEntity("recipe", recipeDetails.name, recipeDetails.label);
            });
        } catch (e) {
            this.errorStore.handleError(e);
        }
    }
}

export const recipeStore = new RecipeStore(errorStore, portalApi, router, sidebarStore);
export const recipeStoreContext = createContext<RecipeStore>(recipeStore);
