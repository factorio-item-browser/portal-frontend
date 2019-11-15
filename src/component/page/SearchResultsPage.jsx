import React from "react";
import {useTranslation} from "react-i18next";

import Section from "../common/Section";
import EntityList from "../entity/EntityList";

/**
 * The component representing the page listing search results.
 * @returns {ReactDOM}
 * @constructor
 */
const SearchResultsPage = () => {
    const entityData = {
        type: "item",
        name: "electronic-circuit",
        label: "Elektronischer Schaltkreis",
        recipes: [
            {
                ingredients: [
                    {
                        type: "item",
                        name: "iron-plate",
                        amount: 1,
                    },
                    {
                        type: "item",
                        name: "copper-cable",
                        amount: 3,
                    },
                ],
                products: [
                    {
                        type: "item",
                        name: "electronic-circuit",
                        amount: 1,
                    },
                ],
                craftingTime: 0.5,
                isExpensive: false,
            },
            {
                ingredients: [
                    {
                        type: "item",
                        name: "iron-plate",
                        amount: 2,
                    },
                    {
                        type: "item",
                        name: "copper-cable",
                        amount: 10,
                    },
                ],
                products: [
                    {
                        type: "item",
                        name: "electronic-circuit",
                        amount: 1,
                    },
                ],
                craftingTime: 0.5,
                isExpensive: true,
            },
        ],
    };
    const data = {
        query: "foo",
        results: [entityData, entityData, entityData, entityData, entityData, entityData, entityData],
        count: 7,
    };



    const { t } = useTranslation();

    return (
        <Section
            headline={t("search-results.headline", {count: data.count, query: data.query})}
        >
            <EntityList entities={data.results} />
        </Section>
    );
};

export default SearchResultsPage;
