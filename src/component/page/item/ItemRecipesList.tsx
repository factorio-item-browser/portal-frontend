import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { EntityData, ItemRecipesData } from "../../../api/transfer";
import { PaginatedList } from "../../../class/PaginatedList";
import PaginatedListButton from "../../button/PaginatedListButton";
import Section from "../../common/Section";
import Entity from "../../entity/Entity";
import EntityList from "../../entity/EntityList";

type Props = {
    paginatedList: PaginatedList<EntityData, ItemRecipesData> | null;
    headlineLocaleKey: string;
};

/**
 * The component representing the recipe list of an item.
 */
const ItemRecipesList: FC<Props> = ({ paginatedList, headlineLocaleKey }) => {
    const { t } = useTranslation();

    if (!paginatedList || paginatedList.numberOfResults === 0) {
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

export default observer(ItemRecipesList);
