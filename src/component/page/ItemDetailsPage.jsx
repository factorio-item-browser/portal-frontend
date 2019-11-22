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

/**
 * The component representing the item and fluid details page.
 * @returns {ReactDOM}
 * @constructor
 */
const ItemDetailsPage = () => {
    const itemStore = useContext(ItemStore);
    const { t } = useTranslation();
    const data = itemStore.currentItemDetails;

    return (
        <Fragment>
            <DetailsHead
                type={data.type}
                name={data.name}
                title={t(`item-details.headline-${data.type}`, { label: data.label })}
            >
                <Detail hidden={!data.description}>{data.description}</Detail>
                <Detail>
                    <CopyTemplate
                        label={t("copy-template.rich-text-icon.label")}
                        template={`[img=${data.type}/${data.name}]`}
                        description={t("copy-template.rich-text-icon.description")}
                    />
                </Detail>
                <Detail hidden={data.type !== "item"}>
                    <CopyTemplate
                        label={t("copy-template.cheat-command.label")}
                        template={`/c game.player.insert{ name="${data.name}", count=10 }`}
                        description={t("copy-template.cheat-command.description")}
                    />
                </Detail>
            </DetailsHead>

            <Section headline={t("item-details.ingredient-in", { count: data.ingredientRecipeCount })}>
                <EntityList>
                    {data.ingredientRecipes.map((recipe) => {
                        return <Entity key={recipe.name} entity={recipe} />;
                    })}
                </EntityList>
            </Section>

            <Section headline={t("item-details.product-of", { count: data.productRecipeCount })}>
                <EntityList>
                    {data.productRecipes.map((recipe) => {
                        return <Entity key={recipe.name} entity={recipe} />;
                    })}
                </EntityList>
            </Section>
        </Fragment>
    );
};

export default observer(ItemDetailsPage);
