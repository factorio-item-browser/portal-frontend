// @flow

import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import PaginatedList from "../../../class/PaginatedList";
import type { EntityData, ItemRecipesData } from "../../../type/transfer";
import PaginatedListButton from "../../button/PaginatedListButton";
import Section from "../../common/Section";
import Entity from "../../entity/Entity";
import EntityList from "../../entity/EntityList";

type Props = {
    paginatedList: PaginatedList<EntityData, ItemRecipesData>,
    headlineLocaleKey: string,
};

/**
 * The component representing the recipe list of an item.
 * @constructor
 */
const ItemRecipesList = ({ paginatedList, headlineLocaleKey }: Props): React$Node => {
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

export default (observer(ItemRecipesList): typeof ItemRecipesList);
