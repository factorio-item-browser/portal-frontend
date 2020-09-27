// @flow

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useCallback, useContext } from "react";
import { searchStoreContext } from "../../../store/SearchStore";

import "./HeaderIcon.scss";

/**
 * The component representing the icon for opening the search bar on mobile devices.
 * @constructor
 */
const SearchIcon = (): React$Node => {
    const searchStore = useContext(searchStoreContext);
    const handleClick = useCallback((): void => {
        searchStore.openSearch();
    }, []);

    return (
        <div className="header-icon" onClick={handleClick}>
            <FontAwesomeIcon icon={faSearch} />
        </div>
    );
};

export default (observer(SearchIcon): typeof SearchIcon);
