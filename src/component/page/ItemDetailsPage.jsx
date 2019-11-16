import {observer} from "mobx-react-lite";
import React, {Fragment, useContext} from "react";
import {useTranslation} from "react-i18next";

import ItemStore from "../../store/ItemStore";
import CopyTemplate from "../common/CopyTemplate";
import Icon from "../common/Icon";
import Section from "../common/Section";
import EntityList from "../entity/EntityList";

import "./ItemDetailsPage.scss";

/**
 * The component representing the item and fluid details page.
 * @returns {ReactDOM}
 * @constructor
 */
const ItemDetailsPage = () => {
    const itemStore = useContext(ItemStore);
    const { t } = useTranslation();
    const data = itemStore.currentItemDetails;

    let cheatCommand = null;
    if (data.type === "item") {
        cheatCommand = (
            <div className="details">
                <CopyTemplate
                    label={t("copy-template.cheat-command.label")}
                    template={`/c game.player.insert{ name="${data.name}", count=10 }`}
                    description={t("copy-template.cheat-command.description")}
                />
            </div>
        );
    }

    return (
        <Fragment>
            <div className="item-details-head">
                <div className="head">
                    <Icon type={data.type} name={data.name} transparent={true} />
                    <h1>{t(`item-details.headline-${data.type}`, {label: data.label})}</h1>
                </div>
                {data.description ? <div className="details">{data.description}</div> : null }
                <div className="details">
                    <CopyTemplate
                        label={t("copy-template.rich-text-icon.label")}
                        template={`[img=${data.type}/${data.name}]`}
                        description={t("copy-template.rich-text-icon.description")}
                    />
                </div>
                {cheatCommand}
            </div>

            <Section headline={t("item-details.ingredient-in", {count: data.ingredientRecipeCount})}>
                <EntityList entities={data.ingredientRecipes} />
            </Section>

            <Section headline={t("item-details.product-of", {count: data.productRecipeCount})}>
                <EntityList entities={data.productRecipes} />
            </Section>
        </Fragment>
    );
};

export default observer(ItemDetailsPage);
