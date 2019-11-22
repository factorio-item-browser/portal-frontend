import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import { breakpointLarge } from "../../../helper/const";
import SearchStore from "../../../store/SearchStore";

import "./HeaderSearch.scss";

/**
 * The component representing the header search element.
 * @returns {ReactDOM}
 * @constructor
 */
const HeaderSearch = () => {
    const isMobile = useMediaQuery({ maxWidth: breakpointLarge });
    const searchStore = useContext(SearchStore);
    const { t } = useTranslation();

    let closeIcon = null;
    if (isMobile) {
        closeIcon = (
            <div
                className="close-icon"
                onClick={() => {
                    searchStore.closeSearch();
                }}
            >
                <FontAwesomeIcon icon={faTimes} />
            </div>
        );
    }

    return (
        <div className="header-search">
            <div className="search-icon">
                {searchStore.isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                    <FontAwesomeIcon icon={faSearch} />
                )}
            </div>
            <input
                autoComplete="off"
                autoFocus={isMobile}
                name="query"
                placeholder={t("header.search.placeholder")}
                type="search"
                value={searchStore.searchQuery}
                onChange={(event) => {
                    searchStore.setSearchQuery(event.target.value);
                }}
            />
            {closeIcon}
        </div>
    );
};

export default observer(HeaderSearch);
