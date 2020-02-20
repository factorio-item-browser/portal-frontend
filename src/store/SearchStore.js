import { action, observable, runInAction } from "mobx";
import { createContext } from "react";

import Cache from "../class/Cache";
import PaginatedList from "../class/PaginatedList";
import { portalApi } from "../class/PortalApi";
import { routeSearch } from "../helper/const";
import { debounce } from "../helper/utils";

import { routeStore } from "./RouteStore";

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
     * Whether the search input element is currently focused.
     * @type {boolean}
     * @private
     */
    _isInputFocused = false;

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
     * @param {RouteStore} routeStore
     */
    constructor(cache, portalApi, routeStore) {
        this._cache = cache;
        this._portalApi = portalApi;
        this._routeStore = routeStore;

        this._debounceHandleQueryChange = debounce(this._handleQueryChange, 500, this);
        this._routeStore.addRoute(routeSearch, "/search/*query", this._handleRouteChange.bind(this));
        this._routeStore.addRouteChangeHandler(this._handleGeneralRouteChange.bind(this));
    }

    /**
     * Handles the change of the route.
     * @param {string} query
     * @returns {Promise<void>}
     * @private
     */
    async _handleRouteChange({ query }) {
        const newPaginatedList = new PaginatedList((page) => this._fetchData(query, page));
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

    /**
     * Handles a general (maybe not-search related) route change.
     * @param {State} route
     * @private
     */
    @action
    _handleGeneralRouteChange({ route }) {
        if (route.name !== routeSearch && !this._isInputFocused) {
            this.searchQuery = "";
        }
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
     * Triggers the query to be changed without waiting for the debounce.
     * @return {Promise<void>}
     */
    async triggerQueryChange() {
        this._handleQueryChange(this.searchQuery);
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
     * Sets whether the input is currently focused.
     * @param {boolean} isInputFocused
     */
    set isInputFocused(isInputFocused) {
        this._isInputFocused = isInputFocused;
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

export const searchStore = new SearchStore(cache, portalApi, routeStore);
export default createContext(searchStore);
