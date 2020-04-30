import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";

import { portalApi } from "../class/PortalApi";
import PaginatedList from "../class/PaginatedList";
import { ROUTE_ITEM_DETAILS } from "../helper/const";

import { routeStore } from "./RouteStore";
import { sidebarStore } from "./SidebarStore";

/**
 * The store for the items. And fluids.
 */
class ItemStore {
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
     * The paginated list of product recipes.
     * @type {PaginatedList<ItemRecipesData,EntityData>}
     */
    @observable
    paginatedProductRecipesList;

    /**
     * The paginated list of ingredient recipes.
     * @type {PaginatedList<ItemRecipesData,EntityData>}
     */
    @observable
    paginatedIngredientRecipesList;

    /**
     * The current item details.
     * @type {{name: string, description: string, label: string, type: string}}
     */
    @observable
    currentItem = {
        type: "",
        name: "",
        label: "",
        description: "",
    };

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

        this._routeStore.addRoute(ROUTE_ITEM_DETAILS, "/:type<item|fluid>/:name", this._handleRouteChange.bind(this));
    }

    /**
     * Handles the change of the route.
     * @param {string} type
     * @param {string} name
     * @returns {Promise<void>}
     * @private
     */
    async _handleRouteChange({ type, name }) {
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
        if (productsData) {
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
     * Handles the Portal API error.
     * @param {PortalApiError} error
     * @private
     */
    @action
    _handlePortalApiError(error) {
        if (error.code === 404) {
            this.currentItem = {
                type: "",
                name: "",
                label: "",
                description: "",
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
        return this.currentItem.type === "";
    }

    /**
     * Returns the entity to highlight.
     * @return {{name: string, type: string}}
     */
    @computed
    get highlightedEntity() {
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

export const itemStore = new ItemStore(portalApi, routeStore, sidebarStore);
export default createContext(itemStore);
