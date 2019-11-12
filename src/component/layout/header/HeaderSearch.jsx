import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

import "./HeaderSearch.scss";

/**
 * The component representing the header search element.
 * @returns {ReactDOM}
 * @constructor
 */
const HeaderSearch = () => {
    return (
        <div className="header-search">
            <div className="search-icon">
                <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
                autoComplete="off"
                name="query"
                placeholder="Item, recipe, ..."
                type="search"
            />
        </div>
    )
};

export default HeaderSearch;
