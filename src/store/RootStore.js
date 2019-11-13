import {action, configure, observable} from "mobx";
import {createContext} from "react";

configure({
    enforceActions: "always",
});

class RootStore {
    @observable
    searchQuery = '';

    @action
    setSearchQuery(searchQuery) {
        this.searchQuery = searchQuery;
    }
}

export default createContext(new RootStore());
