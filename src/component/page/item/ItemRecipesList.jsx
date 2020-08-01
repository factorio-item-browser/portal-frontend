import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import PaginatedListButton from "../../common/PaginatedListButton";
import Section from "../../common/Section";
import Entity from "../../entity/Entity";
import EntityList from "../../entity/EntityList";

/**
 * The component representing the recipe list of an item.
 * @param {PaginatedList<ItemRecipesList,EntityData>} paginatedList
 * @param {string} headlineLocaleKey
 * @constructor
 */
const ItemRecipesList = ({ paginatedList, headlineLocaleKey }) => {
    const { t } = useTranslation();

    if (paginatedList.numberOfResults === 0) {
        return null;
    }

    return (
        <Section headline={t(headlineLocaleKey, { count: paginatedList.numberOfResults })}>
            <EntityList>
                {paginatedList.results.map((recipe) => (
                    <Entity key={recipe.name} entity={recipe} />
                ))}
            </EntityList>
            <PaginatedListButton paginatedList={paginatedList} localePrefix="item-details.more-recipes" />
        </Section>
    );
};

ItemRecipesList.propTypes = {
    paginatedList: PropTypes.object.isRequired,
    headlineLocaleKey: PropTypes.string.isRequired,
};

export default observer(ItemRecipesList);
