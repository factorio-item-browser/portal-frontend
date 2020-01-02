import { action, observable, runInAction } from "mobx";
import { createContext } from "react";

import Cache from "../class/Cache";
import PaginatedList from "../class/PaginatedList";
import { portalApi } from "../class/PortalApi";
import { routeSearch } from "../helper/const";
import { debounce } from "../helper/utils";

/**
 * The store managing everything related to the search.
 */
class SearchStore {
    /**
     * The cache holding the search results.
     * @type {Cache<SearchResultsData>}
     * @private
     */
    _cache;

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
     * The debounce handler for handling the query change.
     * @type {Function}
     * @private
     */
    _debounceHandleQueryChange;

    /**
     * The current search query entered into the search field.
     * @type {string}
     */
    @observable
    searchQuery = "";

    /**
     * Whether the search bar has been opened on mobile.
     * @type {boolean}
     */
    @observable
    isSearchOpened = false;

    /**
     * Whether the search is currently loading results.
     * @type {boolean}
     */
    @observable
    isLoading = false;

    /**
     * The currently executed search query.
     * @type {string}
     */
    @observable
    currentlyExecutedQuery = "";

    /**
     * The paginated search results.
     * @type {PaginatedList<SearchResultsData,EntityData>|null}
     */
    @observable
    paginatedSearchResults;

    /**
     * Initializes the store.
     * @param {Cache<SearchResultsData>} cache
     * @param {PortalApi} portalApi
     */
    constructor(cache, portalApi) {
        this._cache = cache;
        this._portalApi = portalApi;

        this._debounceHandleQueryChange = debounce(this._handleQueryChange, 500, this);
    }

    /**
     * Injects the route store.
     * @param {RouteStore} routeStore
     */
    injectRouteStore(routeStore) {
        this._routeStore = routeStore;
    }

    /**
     * Handles the change of the route.
     * @param {string} query
     * @returns {Promise<void>}
     */
    async handleRouteChange(query) {
        const newPaginatedList = new PaginatedList((page) => this._fetchData(query, page));
        const searchResultsData = await newPaginatedList.requestNextPage();
        runInAction(() => {
            this.paginatedSearchResults = newPaginatedList;
            this.currentlyExecutedQuery = searchResultsData.query;
            this.isLoading = false;
        });
    }

    /**
     * Fetches the data to the search query.
     * @param {string} query
     * @param {int} page
     * @returns {Promise<SearchResultsData>}
     * @private
     */
    async _fetchData(query, page) {
        const cacheKey = `${query}-${page}`;
        const cachedData = this._cache.read(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._portalApi.search(query, page);
        this._cache.write(cacheKey, requestedData);
        return requestedData;
    }

    /**
     * Sets the searchQuery.
     * @param searchQuery
     */
    @action
    setSearchQuery(searchQuery) {
        this.searchQuery = searchQuery;
        this._debounceHandleQueryChange(searchQuery);
    }

    /**
     * Handles the (debounced) change of the query, triggering the search.
     * @param {string} query
     * @returns {Promise<void>}
     * @private
     */
    @action
    async _handleQueryChange(query) {
        if (query.length < 2) {
            return;
        }

        this.isLoading = true;
        this._routeStore.navigateTo(routeSearch, { query: query });
    }

    /**
     * Opens the search bar on the mobile view.
     */
    @action
    openSearch() {
        this.isSearchOpened = true;
    }

    /**
     * Closes the search bar on the mobile view.
     */
    @action
    closeSearch() {
        this.isSearchOpened = false;
    }
}

const cache = new Cache("search", 68400000);

export const searchStore = new SearchStore(cache, portalApi);
export default createContext(searchStore);
