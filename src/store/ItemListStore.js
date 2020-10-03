// @flow

import { observable } from "mobx";
import { createContext } from "react";
import PaginatedList from "../class/PaginatedList";
import { portalApi, PortalApi, PortalApiError } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { ROUTE_ITEM_LIST } from "../const/route";
import type { ItemListData, ItemMetaData } from "../type/transfer";
import { routeStore, RouteStore } from "./RouteStore";

/**
 * The store of the item list page.
 */
export class ItemListStore {
    /**
     * @private
     */
    _portalApi: PortalApi;

    /**
     * @private
     */
    _routeStore: RouteStore;

    @observable
    paginatedItemList: PaginatedList<ItemMetaData, ItemListData>;

    constructor(portalApi: PortalApi, router: Router, routeStore: RouteStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;

        this.paginatedItemList = new PaginatedList(
            (page) => this._portalApi.getItemList(page),
            this._handlePortalApiError.bind(this)
        );

        router.addRoute(ROUTE_ITEM_LIST, "/items", this._handleRouteChange.bind(this));
    }

    /**
     * @private
     */
    async _handleRouteChange(): Promise<void> {
        if (this.paginatedItemList.currentPage === 0) {
            await this.paginatedItemList.requestNextPage();
        }
    }

    /**
     * @private
     */
    _handlePortalApiError(error: PortalApiError): ItemListData {
        this._routeStore.handlePortalApiError(error);
        return {
            results: [],
            numberOfResults: 0,
        };
    }
}

export const itemListStore = new ItemListStore(portalApi, router, routeStore);
export const itemListStoreContext = createContext<ItemListStore>(itemListStore);