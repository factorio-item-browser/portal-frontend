import {action, observable, runInAction} from "mobx";
import {createContext} from "react";

import Cache from "../class/Cache";
import {debounce} from "../helper/utils";

import {routeStore} from "./RouteStore";
import {routeSearch} from "../helper/const";
import {portalApi} from "../class/PortalApi";

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
     * The current search results.
     * @type {SearchResultsData}
     */
    @observable
    currentSearchResults = {
        query: "",
        results: [],
        count: 0,
    };

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

        this._routeStore.addRouteListener(this._handleRouteChange.bind(this));
        this._debounceHandleQueryChange = debounce(this._handleQueryChange, 500, this);
    }

    /**
     * Handles the change of the route.
     * @param {State} route
     * @private
     */
    async _handleRouteChange(route) {
        if (route.name === routeSearch && this.currentSearchResults.query !== route.params.query) {
            await this._handleQueryChange(route.params.query);
        }
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
     * @param {string} searchQuery
     * @returns {Promise<void>}
     * @private
     */
    @action
    async _handleQueryChange(searchQuery) {
        if (searchQuery.length < 2) {
            return;
        }

        this.isLoading = true;

        const data = await this._fetchData(searchQuery);
        runInAction(() => {
            this.currentSearchResults = data;
            this.isLoading = false;

            this._routeStore.navigateTo(routeSearch, {query: searchQuery});
        });
    }

    /**
     * Fetches the data to the search query.
     * @param {string} searchQuery
     * @returns {Promise<SearchResultsData>}
     * @private
     */
    async _fetchData(searchQuery) {
        const cachedData = this._cache.read(searchQuery);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._portalApi.searchQuery(searchQuery);
        this._cache.write(searchQuery, requestedData);
        return requestedData;
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
