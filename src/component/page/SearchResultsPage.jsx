import {observer} from "mobx-react-lite";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";

import SearchStore from "../../store/SearchStore";

import Section from "../common/Section";
import EntityList from "../entity/EntityList";

/**
 * The component representing the page listing search results.
 * @returns {ReactDOM}
 * @constructor
 */
const SearchResultsPage = () => {
    const { t } = useTranslation();
    const searchStore = useContext(SearchStore);

    return (
        <Section
            headline={t("search-results.headline", {
                count: searchStore.currentSearchResultCount,
                query: searchStore.currentSearchQuery,
            })}
        >
            <EntityList entities={searchStore.currentSearchResults} />
        </Section>
    );
};

export default observer(SearchResultsPage);
