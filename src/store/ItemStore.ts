import { action, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import { PortalApi, portalApi } from "../api/PortalApi";
import { emptyItemRecipesData } from "../api/empty";
import { EntityData, ItemRecipesData, ItemType } from "../api/transfer";
import { PaginatedList } from "../class/PaginatedList";
import { router, Router } from "../class/Router";
import { RouteName } from "../util/const";
import { errorStore, ErrorStore } from "./ErrorStore";
import { sidebarStore, SidebarStore } from "./SidebarStore";

type Item = {
    type: ItemType;
    name: string;
    label: string;
    description: string;
};

const emptyItem: Item = {
    type: "item",
    name: "",
    label: "",
    description: "",
};

export class ItemStore {
    private readonly errorStore: ErrorStore;
    private readonly portalApi: PortalApi;
    private readonly sidebarStore: SidebarStore;

    /** The item details to be shown. */
    public item: Item = emptyItem;
    /** The paginated list of recipes having the item as ingredient. */
    public paginatedIngredientRecipesList: PaginatedList<EntityData, ItemRecipesData> | null = null;
    /** The paginated list of recipes having the item as product. */
    public paginatedProductRecipesList: PaginatedList<EntityData, ItemRecipesData> | null = null;

    public constructor(errorStore: ErrorStore, portalApi: PortalApi, router: Router, sidebarStore: SidebarStore) {
        this.errorStore = errorStore;
        this.portalApi = portalApi;
        this.sidebarStore = sidebarStore;

        makeObservable<this, "handleRouteChange">(this, {
            item: observable,
            paginatedIngredientRecipesList: observable,
            paginatedProductRecipesList: observable,
            handleRouteChange: action,
        });

        router.addRoute(RouteName.ItemDetails, "/:type<item|fluid>/:name", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(state: State): Promise<void> {
        const { type, name } = state.params;

        const newProductsList = new PaginatedList<EntityData, ItemRecipesData>(
            (page) => this.portalApi.getItemProductRecipes(type, name, page),
            this.errorStore.createPaginatesListErrorHandler(emptyItemRecipesData),
        );
        const newIngredientsList = new PaginatedList<EntityData, ItemRecipesData>(
            (page) => this.portalApi.getItemIngredientRecipes(type, name, page),
            this.errorStore.createPaginatesListErrorHandler(emptyItemRecipesData),
        );

        const [productsData] = await Promise.all([
            newProductsList.requestNextPage(),
            newIngredientsList.requestNextPage(),
        ]);

        if (productsData.name !== "") {
            runInAction(() => {
                this.paginatedProductRecipesList = newProductsList;
                this.paginatedIngredientRecipesList = newIngredientsList;

                this.item = {
                    type: productsData.type,
                    name: productsData.name,
                    label: productsData.label,
                    description: productsData.description,
                };

                this.sidebarStore.addViewedEntity(productsData.type, productsData.name, productsData.label);
            });
        }
    }
}

export const itemStore = new ItemStore(errorStore, portalApi, router, sidebarStore);
export const itemStoreContext = createContext(itemStore);
