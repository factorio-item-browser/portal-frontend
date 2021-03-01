import { makeObservable, observable } from "mobx";
import { createContext } from "react";
import { PaginatedList } from "../class/PaginatedList";
import { portalApi, PortalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { Route } from "../const/route";
import { ItemListData, ItemMetaData } from "../type/transfer";
import { errorStore, ErrorStore } from "./ErrorStore";

const emptyItemList: ItemListData = {
    results: [],
    numberOfResults: 0,
};

export class ItemListStore {
    private readonly errorStore: ErrorStore;
    private readonly portalApi: PortalApi;

    /** The paginated list of all items. */
    public paginatedItemList: PaginatedList<ItemMetaData, ItemListData>;

    public constructor(errorStore: ErrorStore, portalApi: PortalApi, router: Router) {
        this.errorStore = errorStore;
        this.portalApi = portalApi;

        makeObservable(this, {
            paginatedItemList: observable,
        });

        this.paginatedItemList = new PaginatedList(
            (page) => this.portalApi.getItemList(page),
            this.errorStore.createPaginatesListErrorHandler(emptyItemList),
        );

        router.addRoute(Route.ItemList, "/items", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(): Promise<void> {
        if (this.paginatedItemList.currentPage === 0) {
            await this.paginatedItemList.requestNextPage();
        }
    }
}

export const itemListStore = new ItemListStore(errorStore, portalApi, router);
export const itemListStoreContext = createContext(itemListStore);
