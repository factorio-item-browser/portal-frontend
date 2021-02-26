import { faSearch, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINT_LARGE } from "../../../const/breakpoint";
import { routeStoreContext } from "../../../store/RouteStore";
import { searchStoreContext } from "../../../store/SearchStore";

import "./HeaderSearch.scss";

/**
 * The component representing the header search element.
 */
const HeaderSearch: FC = () => {
    const routeStore = useContext(routeStoreContext);
    const searchStore = useContext(searchStoreContext);

    const isLarge = useMediaQuery({ minWidth: BREAKPOINT_LARGE });
    const { t } = useTranslation();

    let searchIcon = <FontAwesomeIcon icon={faSearch} />;
    if (searchStore.isLoading) {
        searchIcon = <FontAwesomeIcon icon={faSpinner} spin />;
    }

    let closeIcon = null;
    if (!isLarge && !routeStore.useBigHeader) {
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
            <div className="search-icon">{searchIcon}</div>
            <form
                onSubmit={async (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    await searchStore.triggerQueryChange();
                    return false;
                }}
            >
                <input
                    autoComplete="off"
                    autoFocus={!isLarge}
                    name="query"
                    placeholder={t("header.search.placeholder")}
                    type="search"
                    value={searchStore.searchQuery}
                    onChange={async (event) => {
                        return searchStore.setSearchQuery(event.target.value);
                    }}
                    onFocus={() => {
                        searchStore.isInputFocused = true;
                    }}
                    onBlur={() => {
                        searchStore.isInputFocused = false;
                    }}
                />
            </form>
            {closeIcon}
        </div>
    );
};

export default observer(HeaderSearch);
