import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

import "./HeaderIcon.scss";

/**
 * The component representing the icon for opening the search bar on mobile devices.
 * @returns {ReactDOM}
 * @constructor
 */
const SearchIcon = () => {
    return (
        <div className="header-icon">
            <FontAwesomeIcon icon={faSearch} />
        </div>
    );
};

export default SearchIcon;
