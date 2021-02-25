import { action, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import { debounce } from "throttle-debounce";
import { PaginatedList } from "../class/PaginatedList";
import { PortalApi, portalApi, PortalApiError } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { ROUTE_SEARCH } from "../const/route";
import type { EntityData, SearchResultsData } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";

const emptySearchResultsData: SearchResultsData = {
    query: "",
    results: [],
    numberOfResults: 0,
};

export class SearchStore {
    private readonly debouncedHandleQueryChange: (query: string) => Promise<void>;

    /**
     * Whether the input field is currently focused.
     */
    public isInputFocused: boolean = false;

    /**
     * The current search query entered into the search field.
     */
    public searchQuery: string = "";

    /**
     * The search query which has currently been requested.
     */
    public requestedSearchQuery: string = "";

    /**
     * Whether the search bar has been opened on mobile.
     */
    public isSearchOpened: boolean = false;

    /**
     * Whether the search is currently loading results.
     */
    public isLoading: boolean = false;

    /**
     * The currently executed search query.
     */
    public currentlyExecutedQuery: string = "";

    /**
     * The paginated search results.
     */
    public paginatedSearchResults: PaginatedList<EntityData, SearchResultsData> | null = null;

    public constructor(
        private readonly portalApi: PortalApi,
        private readonly router: Router,
        private readonly routeStore: RouteStore,
    ) {
        this.debouncedHandleQueryChange = debounce(500, this.handleQueryChange.bind(this));

        makeObservable<this, "handleGlobalRouteChange" | "handleQueryChange">(this, {
            closeSearch: action,
            currentlyExecutedQuery: observable,
            handleGlobalRouteChange: action,
            handleQueryChange: action,
            isLoading: observable,
            isSearchOpened: observable,
            openSearch: action,
            paginatedSearchResults: observable,
            requestedSearchQuery: observable,
            searchQuery: observable,
            setSearchQuery: action,
        });

        router.addRoute(ROUTE_SEARCH, "/search/:query", this.handleRouteChange.bind(this));
        router.addGlobalChangeHandler(this.handleGlobalRouteChange.bind(this));
    }

    private async handleRouteChange(state: State): Promise<void> {
        const { query } = state.params;
        const newPaginatedList = new PaginatedList<EntityData, SearchResultsData>(
            (page) => this.portalApi.search(query, page),
            (error) => this.handlePortalApiError(error)
        );

        const searchResultsData = await newPaginatedList.requestNextPage();
        runInAction(() => {
            this.paginatedSearchResults = newPaginatedList;
            this.currentlyExecutedQuery = searchResultsData.query;
            this.isLoading = false;

            if (!this.isInputFocused) {
                this.searchQuery = query;
            }
        });
    }

    private handleGlobalRouteChange(state: State) {
        if (state.name !== ROUTE_SEARCH && !this.isInputFocused) {
            this.searchQuery = "";
            this.requestedSearchQuery = "";
        }
    }

    public async setSearchQuery(searchQuery: string): Promise<void> {
        this.searchQuery = searchQuery;
        if (this.isInputFocused) {
            this.isSearchOpened = true;
        }
        await this.debouncedHandleQueryChange(searchQuery);
    }

    /**
     * Triggers the query to be changed without waiting for the debounce.
     */
    public async triggerQueryChange(): Promise<void> {
        await this.handleQueryChange(this.searchQuery);
    }

    /**
     * Handles the (debounced) change of the query, triggering the search.
     */
    private async handleQueryChange(query: string): Promise<void> {
        if (query.length < 2 || query === this.requestedSearchQuery) {
            return;
        }

        this.requestedSearchQuery = query;
        this.isLoading = true;
        this.router.navigateTo(ROUTE_SEARCH, { query: query });
    }

    private handlePortalApiError(error: PortalApiError): SearchResultsData {
        this.routeStore.handlePortalApiError(error);
        return emptySearchResultsData;
    }

    public openSearch(): void {
        this.isSearchOpened = true;
    }

    public closeSearch(): void {
        this.isSearchOpened = false;
    }
}

export const searchStore = new SearchStore(portalApi, router, routeStore);
export const searchStoreContext = createContext<SearchStore>(searchStore);
