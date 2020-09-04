// @flow

import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { searchStoreContext } from "../../store/SearchStore";
import { useDocumentTitle } from "../../util/hooks";
import PaginatedListButton from "../button/PaginatedListButton";
import Section from "../common/Section";
import Entity from "../entity/Entity";
import EntityList from "../entity/EntityList";

/**
 * The component representing the page listing search results.
 * @constructor
 */
const SearchResultsPage = (): React$Node => {
    const { t } = useTranslation();
    const searchStore = useContext(searchStoreContext);

    useDocumentTitle("search-results.title", { query: searchStore.currentlyExecutedQuery });

    if (!searchStore.paginatedSearchResults) {
        return null;
    }

    return (
        <Section
            headline={t("search-results.headline", {
                count: searchStore.paginatedSearchResults.numberOfResults,
                query: searchStore.currentlyExecutedQuery,
            })}
        >
            <EntityList>
                {searchStore.paginatedSearchResults.results.map((result) => {
                    return <Entity key={`${result.type}.${result.name}`} entity={result} />;
                })}
            </EntityList>

            <PaginatedListButton
                paginatedList={searchStore.paginatedSearchResults}
                localePrefix="search-results.more-results"
                loadOnScroll={true}
            />
        </Section>
    );
};

export default (observer(SearchResultsPage): typeof SearchResultsPage);
