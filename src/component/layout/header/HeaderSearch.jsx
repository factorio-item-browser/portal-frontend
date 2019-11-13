import React, {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

import RootStore from "../../../store/RootStore";

import "./HeaderSearch.scss";
import {observer} from "mobx-react-lite";

/**
 * The component representing the header search element.
 * @returns {ReactDOM}
 * @constructor
 */
const HeaderSearch = () => {
    const rootStore = useContext(RootStore);
    const { t } = useTranslation();

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
                value={rootStore.searchQuery}
                onChange={(event) => {
                    rootStore.setSearchQuery(event.target.value);
                }}
            />
        </div>
    )
};

export default observer(HeaderSearch);
