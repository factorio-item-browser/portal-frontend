import {action, observable} from "mobx";
import {createContext} from "react";

/**
 * The store managing everything related to the search.
 */
class SearchStore {
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
     * Sets the searchQuery.
     * @param searchQuery
     */
    @action
    setSearchQuery(searchQuery) {
        this.searchQuery = searchQuery;
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

export const searchStore = new SearchStore();
export default createContext(searchStore);
