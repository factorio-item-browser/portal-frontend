import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import { PaginatedList } from "../class/PaginatedList";
import { PortalApi, portalApi, PortalApiError } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { ROUTE_ITEM_DETAILS } from "../const/route";
import { EntityData, ItemRecipesData, ItemType } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";
import { SidebarStore, sidebarStore } from "./SidebarStore";

interface Item {
    type: ItemType;
    name: string;
    label: string;
    description: string;
}

const emptyItem: Item = {
    type: "item",
    name: "",
    label: "",
    description: "",
};
const emptyItemRecipesData: ItemRecipesData = {
    type: "item",
    name: "",
    label: "",
    description: "",
    results: [],
    numberOfResults: 0,
};


export class ItemStore {
    private readonly portalApi: PortalApi;
    private readonly routeStore: RouteStore;
    private readonly sidebarStore: SidebarStore;

    public paginatedProductRecipesList: PaginatedList<EntityData, ItemRecipesData> | null = null;
    public paginatedIngredientRecipesList: PaginatedList<EntityData, ItemRecipesData> | null = null;
    public currentItem: Item = emptyItem;

    public constructor(
        portalApi: PortalApi,
        router: Router,
        routeStore: RouteStore,
        sidebarStore: SidebarStore,
    ) {
        this.portalApi = portalApi;
        this.routeStore = routeStore;
        this.sidebarStore = sidebarStore;

        makeObservable<this, "handlePortalApiError">(this, {
            handlePortalApiError: action,
            currentItem: observable,
            hasNotFoundError: computed,
            highlightedEntity: computed,
            paginatedProductRecipesList: observable,
            paginatedIngredientRecipesList: observable,
        });

        router.addRoute(ROUTE_ITEM_DETAILS, "/:type<item|fluid>/:name", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(state: State): Promise<void> {
        const { type, name } = state.params;

        const newProductsList = new PaginatedList<EntityData, ItemRecipesData>(
            (page) => this.portalApi.getItemProductRecipes(type, name, page),
            (error) => this.handlePortalApiError(error)
        );
        const newIngredientsList = new PaginatedList<EntityData, ItemRecipesData>(
            (page) => this.portalApi.getItemIngredientRecipes(type, name, page),
            (error) => this.handlePortalApiError(error)
        );

        const [productsData] = await Promise.all([
            newProductsList.requestNextPage(),
            newIngredientsList.requestNextPage(),
        ]);

        if (productsData.name !== "") {
            runInAction(() => {
                this.paginatedProductRecipesList = newProductsList;
                this.paginatedIngredientRecipesList = newIngredientsList;

                this.currentItem = {
                    type: productsData.type,
                    name: productsData.name,
                    label: productsData.label,
                    description: productsData.description,
                };

                this.sidebarStore.addViewedEntity(productsData.type, productsData.name, productsData.label);
            });
        }
    }

    private handlePortalApiError(error: PortalApiError): ItemRecipesData {
        if (error.code === 404) {
            this.currentItem = emptyItem;
        } else {
            this.routeStore.handlePortalApiError(error);
        }
        return emptyItemRecipesData;
    }

    public get hasNotFoundError(): boolean {
        return this.currentItem.name === "";
    }

    public get highlightedEntity(): { type: string, name: string } {
        if (this.routeStore.currentRoute !== ROUTE_ITEM_DETAILS) {
            return {
                type: "",
                name: "",
            };
        }

        return {
            type: this.currentItem.type,
            name: this.currentItem.name,
        };
    }
}

export const itemStore = new ItemStore(portalApi, router, routeStore, sidebarStore);
export const itemStoreContext = createContext<ItemStore>(itemStore);
