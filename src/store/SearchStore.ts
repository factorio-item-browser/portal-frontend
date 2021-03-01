import { action, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import { debounce } from "throttle-debounce";
import { PaginatedList } from "../class/PaginatedList";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { EntityData, SearchResultsData } from "../type/transfer";
import { RouteName } from "../util/const";
import { errorStore, ErrorStore } from "./ErrorStore";

const emptySearchResults: SearchResultsData = {
    query: "",
    results: [],
    numberOfResults: 0,
};

export class SearchStore {
    private readonly errorStore: ErrorStore;
    private readonly portalApi: PortalApi;
    private readonly router: Router;
    private readonly debouncedHandleQueryChange: (query: string) => Promise<void>;

    /** Whether the input field is currently focused. */
    public isInputFocused = false;
    /** The current search query entered into the search field. */
    public searchQuery = "";
    /** The search query which has currently been requested. */
    public requestedSearchQuery = "";
    /** Whether the search bar has been opened on mobile. */
    public isSearchOpened = false;
    /** Whether the search is currently loading results. */
    public isLoading = false;
    /** The currently executed search query. */
    public currentlyExecutedQuery = "";
    /** The paginated search results. */
    public paginatedSearchResults: PaginatedList<EntityData, SearchResultsData> | null = null;

    public constructor(errorStore: ErrorStore, portalApi: PortalApi, router: Router) {
        this.errorStore = errorStore;
        this.portalApi = portalApi;
        this.router = router;
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
            updateSearchQuery: action,
        });

        router.addRoute(RouteName.Search, "/search/:query", this.handleRouteChange.bind(this));
        router.addGlobalChangeHandler(this.handleGlobalRouteChange.bind(this));
    }

    private async handleRouteChange(state: State): Promise<void> {
        const { query } = state.params;
        const newPaginatedList = new PaginatedList<EntityData, SearchResultsData>(
            (page) => this.portalApi.search(query, page),
            this.errorStore.createPaginatesListErrorHandler(emptySearchResults),
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
        if (state.name !== RouteName.Search && !this.isInputFocused) {
            this.searchQuery = "";
            this.requestedSearchQuery = "";
        }
    }

    public async updateSearchQuery(searchQuery: string): Promise<void> {
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
     * Opens the search input field on mobile.
     */
    public openSearch(): void {
        this.isSearchOpened = true;
    }

    /**
     * Closes the search input field on mobile.
     */
    public closeSearch(): void {
        this.isSearchOpened = false;
    }

    private async handleQueryChange(query: string): Promise<void> {
        if (query.length < 2 || query === this.requestedSearchQuery) {
            return;
        }

        this.requestedSearchQuery = query;
        this.isLoading = true;
        this.router.navigateTo(RouteName.Search, { query: query });
    }
}

export const searchStore = new SearchStore(errorStore, portalApi, router);
export const searchStoreContext = createContext<SearchStore>(searchStore);
