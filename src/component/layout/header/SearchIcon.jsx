import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";

import { searchStoreContext } from "../../../store/SearchStore";

import "./HeaderIcon.scss";

/**
 * The component representing the icon for opening the search bar on mobile devices.
 * @returns {ReactDOM}
 * @constructor
 */
const SearchIcon = () => {
    const searchStore = useContext(searchStoreContext);

    return (
        <div
            className="header-icon"
            onClick={() => {
                searchStore.openSearch();
            }}
        >
            <FontAwesomeIcon icon={faSearch} />
        </div>
    );
};

export default observer(SearchIcon);
