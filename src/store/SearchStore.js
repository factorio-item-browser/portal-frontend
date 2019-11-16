import {action, observable, runInAction} from "mobx";
import {createContext} from "react";

import {debounce} from "../helper/utils";

import {pageStore} from "./PageStore";
import {routeSearch} from "../helper/const";
import {portalApi} from "../class/PortalApi";

/**
 * The store managing everything related to the search.
 */
class SearchStore {
    /**
     * The page store.
     * @type {PageStore}
     * @private
     */
    _pageStore;

    /**
     * The Portal API instance.
     * @type {PortalApi}
     * @private
     */
    _portalApi;

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
     * The current search query which has been executed.
     * @type {string}
     */
    @observable
    currentSearchQuery = "";

    /**
     * The current search results.
     * @type {EntityData[]}
     */
    @observable
    currentSearchResults = [];

    /**
     * The current count of search results.
     * @type {number}
     */
    @observable
    currentSearchResultCount = 0;

    /**
     * Initializes the store.
     * @param {PageStore} pageStore
     * @param {PortalApi} portalApi
     */
    constructor(pageStore, portalApi) {
        this._pageStore = pageStore;
        this._pageStore.addRouteListener(this._handlePageChange);
        this._portalApi = portalApi;

        this._debounceHandleQueryChange = debounce(this._handleQueryChange, 500, this);
    }

    _handlePageChange(route, previousRoute) {
        console.log(route, previousRoute);
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
        this.isLoading = true;

        const data = await this._portalApi.searchQuery(searchQuery);
        runInAction(() => {
            this.currentSearchQuery = data.query;
            this.currentSearchResults = data.results;
            this.currentSearchResultCount = data.count;
            this.isLoading = false;

            this._pageStore.navigateTo(routeSearch, {query: searchQuery});
        });
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

export const searchStore = new SearchStore(pageStore, portalApi);
export default createContext(searchStore);
