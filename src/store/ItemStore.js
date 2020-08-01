// @flow

import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";
import { State } from "router5";

import { PortalApi, portalApi, PortalApiError } from "../class/PortalApi";
import PaginatedList from "../class/PaginatedList";
import { ROUTE_ITEM_DETAILS } from "../const/route";

import { RouteStore, routeStore } from "./RouteStore";
import { SidebarStore, sidebarStore } from "./SidebarStore";
import type { EntityData, ItemRecipesData, ItemType } from "../type/transfer";
import { router, Router } from "../class/Router";

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

/**
 * The store for the items. And fluids.
 */
export class ItemStore {
    /**
     * @private
     */
    _portalApi: PortalApi;

    /**
     * @private
     */
    _routeStore: RouteStore;

    /**
     * @private
     */
    _sidebarStore: SidebarStore;

    /**
     * The paginated list of product recipes.
     */
    @observable
    paginatedProductRecipesList: PaginatedList<EntityData, ItemRecipesData>;

    /**
     * The paginated list of ingredient recipes.
     */
    @observable
    paginatedIngredientRecipesList: PaginatedList<EntityData, ItemRecipesData>;

    /**
     * The current item details.
     */
    @observable
    currentItem: Item = emptyItem;

    constructor(portalApi: PortalApi, router: Router, routeStore: RouteStore, sidebarStore: SidebarStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;
        this._sidebarStore = sidebarStore;

        router.addRoute(ROUTE_ITEM_DETAILS, "/:type<item|fluid>/:name", this._handleRouteChange.bind(this));
    }

    /**
     * @private
     */
    async _handleRouteChange(state: State): Promise<void> {
        const { type, name } = state.params;

        const newProductsList = new PaginatedList(
            (page) => this._portalApi.getItemProductRecipes(type, name, page),
            (error) => this._handlePortalApiError(error)
        );
        const newIngredientsList = new PaginatedList(
            (page) => this._portalApi.getItemIngredientRecipes(type, name, page),
            (error) => this._handlePortalApiError(error)
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

                this._sidebarStore.addViewedEntity(productsData.type, productsData.name, productsData.label);
            });
        }
    }

    /**
     * @private
     */
    @action
    _handlePortalApiError(error: PortalApiError): ItemRecipesData {
        if (error.code === 404) {
            this.currentItem = emptyItem;
        } else {
            this._routeStore.handlePortalApiError(error);
        }
        return emptyItemRecipesData;
    }

    @computed
    get hasNotFoundError(): boolean {
        return this.currentItem.name === "";
    }

    /**
     * Returns the entity to highlight.
     */
    @computed
    get highlightedEntity(): { type: string, name: string } {
        if (this._routeStore.currentRoute !== ROUTE_ITEM_DETAILS) {
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
