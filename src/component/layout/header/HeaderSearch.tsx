import { faSearch, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { globalStoreContext } from "../../../store/GlobalStore";
import { searchStoreContext } from "../../../store/SearchStore";
import { Breakpoint } from "../../../util/const";

import "./HeaderSearch.scss";

/**
 * The component representing the header search element.
 */
const HeaderSearch: FC = () => {
    const globalStore = useContext(globalStoreContext);
    const searchStore = useContext(searchStoreContext);

    const isLarge = useMediaQuery({ minWidth: Breakpoint.Large });
    const { t } = useTranslation();

    let searchIcon = <FontAwesomeIcon icon={faSearch} />;
    if (searchStore.isLoading) {
        searchIcon = <FontAwesomeIcon icon={faSpinner} spin />;
    }

    let closeIcon = null;
    if (!isLarge && !globalStore.useBigHeader) {
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
                        return searchStore.updateSearchQuery(event.target.value);
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
