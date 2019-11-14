import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext} from "react";

import SearchStore from "../../../store/SearchStore";

import "./HeaderIcon.scss";

/**
 * The component representing the icon for opening the search bar on mobile devices.
 * @returns {ReactDOM}
 * @constructor
 */
const SearchIcon = () => {
    const searchStore = useContext(SearchStore);

    return (
        <div
            className="header-icon"
            onClick={() => {
                searchStore.open();
            }}
        >
            <FontAwesomeIcon icon={faSearch} />
        </div>
    );
};

export default SearchIcon;
