// @flow

import { action, observable, runInAction } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import PaginatedList from "../class/PaginatedList";
import { PortalApi, portalApi, PortalApiError } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { ROUTE_SEARCH } from "../const/route";
import { debounce } from "../helper/utils";
import type { EntityData, SearchResultsData } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";

const emptySearchResultsData: SearchResultsData = {
    query: "",
    results: [],
    numberOfResults: 0,
};

/**
 * The store managing everything related to the search.
 */
export class SearchStore {
    /**
     * @private
     */
    _portalApi: PortalApi;

    /**
     * @private
     */
    _router: Router;

    /**
     * @private
     */
    _routeStore: RouteStore;

    /**
     * The debounce handler for handling the query change.
     * @private
     */
    _debounceHandleQueryChange: (string) => Promise<void>;

    /**
     * @private
     */
    _isInputFocused: boolean = false;

    /**
     * The current search query entered into the search field.
     */
    @observable
    searchQuery: string = "";

    /**
     * The search query which has currently been requested.
     */
    @observable
    requestedSearchQuery: string = "";

    /**
     * Whether the search bar has been opened on mobile.
     */
    @observable
    isSearchOpened: boolean = false;

    /**
     * Whether the search is currently loading results.
     */
    @observable
    isLoading: boolean = false;

    /**
     * The currently executed search query.
     */
    @observable
    currentlyExecutedQuery: string = "";

    /**
     * The paginated search results.
     */
    @observable
    paginatedSearchResults: PaginatedList<EntityData, SearchResultsData>;

    constructor(portalApi: PortalApi, router: Router, routeStore: RouteStore) {
        this._portalApi = portalApi;
        this._router = router;
        this._routeStore = routeStore;

        this._debounceHandleQueryChange = debounce(this._handleQueryChange, 500, this);

        router.addRoute(ROUTE_SEARCH, "/search/*query", this._handleRouteChange.bind(this));
        router.addGlobalChangeHandler(this._handleGlobalRouteChange.bind(this));
    }

    /**
     * @private
     */
    async _handleRouteChange(state: State): Promise<void> {
        const { query } = state.params;

        const newPaginatedList = new PaginatedList(
            (page) => this._portalApi.search(query, page),
            (error) => this._handlePortalApiError(error)
        );

        const searchResultsData = await newPaginatedList.requestNextPage();
        runInAction(() => {
            this.paginatedSearchResults = newPaginatedList;
            this.currentlyExecutedQuery = searchResultsData.query;
            this.isLoading = false;

            if (!this._isInputFocused) {
                this.searchQuery = query;
            }
        });
    }

    @action
    _handleGlobalRouteChange(state: State) {
        if (state.name !== ROUTE_SEARCH && !this._isInputFocused) {
            this.searchQuery = "";
            this.requestedSearchQuery = "";
        }
    }

    @action
    async setSearchQuery(searchQuery: string): Promise<void> {
        this.searchQuery = searchQuery;
        if (this._isInputFocused) {
            this.isSearchOpened = true;
        }
        await this._debounceHandleQueryChange(searchQuery);
    }

    /**
     * Triggers the query to be changed without waiting for the debounce.
     */
    async triggerQueryChange(): Promise<void> {
        await this._handleQueryChange(this.searchQuery);
    }

    /**
     * Handles the (debounced) change of the query, triggering the search.
     * @private
     */
    @action
    async _handleQueryChange(query: string): Promise<void> {
        if (query.length < 2 || query === this.requestedSearchQuery) {
            return;
        }

        this.requestedSearchQuery = query;
        this.isLoading = true;
        this._router.navigateTo(ROUTE_SEARCH, { query: query });
    }

    /**
     * @private
     */
    @action
    _handlePortalApiError(error: PortalApiError): SearchResultsData {
        this._routeStore.handlePortalApiError(error);
        return emptySearchResultsData;
    }

    set isInputFocused(isInputFocused: boolean): void {
        this._isInputFocused = isInputFocused;
    }

    @action
    openSearch(): void {
        this.isSearchOpened = true;
    }

    @action
    closeSearch(): void {
        this.isSearchOpened = false;
    }
}

export const searchStore = new SearchStore(portalApi, router, routeStore);
export const searchStoreContext = createContext<SearchStore>(searchStore);
