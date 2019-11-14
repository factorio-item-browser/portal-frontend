import {action, observable} from "mobx";
import {createContext} from "react";

/**
 * The store managing everything related to the search.
 */
class SearchStore {
    /**
     * The current query entered into the search field.
     * @type {string}
     */
    @observable
    query = "";

    /**
     * Whether the search bar has been opened on mobile.
     * @type {boolean}
     */
    @observable
    isOpened = false;

    /**
     * Sets the query.
     * @param query
     */
    @action
    setQuery(query) {
        this.query = query;
    }

    /**
     * Opens the search bar on the mobile view.
     */
    @action
    open() {
        this.isOpened = true;
    }

    /**
     * Closes the search bar on the mobile view.
     */
    @action
    close() {
        this.isOpened = false;
    }
}

export const searchStore = new SearchStore();
export default createContext(searchStore);
