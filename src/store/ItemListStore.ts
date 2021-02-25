import { makeObservable, observable } from "mobx";
import { createContext } from "react";
import { PaginatedList } from "../class/PaginatedList";
import { portalApi, PortalApi, PortalApiError } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { ROUTE_ITEM_LIST } from "../const/route";
import type { ItemListData, ItemMetaData } from "../type/transfer";
import { routeStore, RouteStore } from "./RouteStore";

export class ItemListStore {
    public paginatedItemList: PaginatedList<ItemMetaData, ItemListData>;

    public constructor(
        private readonly portalApi: PortalApi,
        private readonly routeStore: RouteStore,
        router: Router,
    ) {
        makeObservable(this, {
            paginatedItemList: observable,
        });

        this.paginatedItemList = new PaginatedList(
            (page) => this.portalApi.getItemList(page),
            this.handlePortalApiError.bind(this)
        );

        router.addRoute(ROUTE_ITEM_LIST, "/items", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(): Promise<void> {
        if (this.paginatedItemList.currentPage === 0) {
            await this.paginatedItemList.requestNextPage();
        }
    }

    private handlePortalApiError(error: PortalApiError): ItemListData {
        this.routeStore.handlePortalApiError(error);
        return {
            results: [],
            numberOfResults: 0,
        };
    }
}

export const itemListStore = new ItemListStore(portalApi, routeStore, router);
export const itemListStoreContext = createContext<ItemListStore>(itemListStore);
