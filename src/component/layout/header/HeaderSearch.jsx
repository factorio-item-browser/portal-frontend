import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

import "./HeaderSearch.scss";

/**
 * The component representing the header search element.
 * @returns {ReactDOM}
 * @constructor
 */
const HeaderSearch = () => {
    const {t} = useTranslation();

    return (
        <div className="header-search">
            <div className="search-icon">
                <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
                autoComplete="off"
                name="query"
                placeholder={t("header.search.placeholder")}
                type="search"
            />
        </div>
    )
};

export default HeaderSearch;
