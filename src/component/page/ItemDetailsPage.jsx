import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { useTranslation } from "react-i18next";

import ItemStore from "../../store/ItemStore";

import CopyTemplate from "../common/CopyTemplate";
import Detail from "../common/Detail";
import DetailsHead from "../common/DetailsHead";
import Section from "../common/Section";
import Entity from "../entity/Entity";
import EntityList from "../entity/EntityList";
import PaginatedListButton from "../common/PaginatedListButton";

/**
 * The component representing the item and fluid details page.
 * @returns {ReactDOM}
 * @constructor
 */
const ItemDetailsPage = () => {
    const itemStore = useContext(ItemStore);
    const { t } = useTranslation();

    return (
        <Fragment>
            <DetailsHead
                type={itemStore.currentItem.type}
                name={itemStore.currentItem.name}
                title={t(`item-details.headline-${itemStore.currentItem.type}`, { label: itemStore.currentItem.label })}
            >
                <Detail hidden={!itemStore.currentItem.description}>{itemStore.currentItem.description}</Detail>
                <Detail>
                    <CopyTemplate
                        label={t("copy-template.rich-text-icon.label")}
                        template={`[img=${itemStore.currentItem.type}/${itemStore.currentItem.name}]`}
                        description={t("copy-template.rich-text-icon.description")}
                    />
                </Detail>
                <Detail hidden={itemStore.currentItem.type !== "item"}>
                    <CopyTemplate
                        label={t("copy-template.cheat-command.label")}
                        template={`/c game.player.insert{ name="${itemStore.currentItem.name}", count=10 }`}
                        description={t("copy-template.cheat-command.description")}
                    />
                </Detail>
            </DetailsHead>

            <Section
                headline={t("item-details.ingredient-in", {
                    count: itemStore.paginatedProductRecipesList.numberOfResults,
                })}
            >
                <EntityList>
                    {itemStore.paginatedProductRecipesList.results.map((recipe) => {
                        return <Entity key={recipe.name} entity={recipe} />;
                    })}
                </EntityList>
                <PaginatedListButton
                    paginatedList={itemStore.paginatedProductRecipesList}
                    localePrefix="item-details.more-recipes"
                />
            </Section>

            <Section
                headline={t("item-details.product-of", {
                    count: itemStore.paginatedIngredientRecipesList.numberOfResults,
                })}
            >
                <EntityList>
                    {itemStore.paginatedIngredientRecipesList.results.map((recipe) => {
                        return <Entity key={recipe.name} entity={recipe} />;
                    })}
                </EntityList>
                <PaginatedListButton
                    paginatedList={itemStore.paginatedIngredientRecipesList}
                    localePrefix="item-details.more-recipes"
                />
            </Section>
        </Fragment>
    );
};

export default observer(ItemDetailsPage);
