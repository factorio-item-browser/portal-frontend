import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ItemStore from "../../store/ItemStore";

import CopyTemplate from "../common/CopyTemplate";
import Detail from "../common/Detail";
import DetailsHead from "../common/DetailsHead";
import ItemRecipesList from "./item/ItemRecipesList";

/**
 * The component representing the item and fluid details page.
 * @returns {ReactDOM}
 * @constructor
 */
const ItemDetailsPage = () => {
    const itemStore = useContext(ItemStore);
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t(`item-details.title.${itemStore.currentItem.type}`, { label: itemStore.currentItem.label });
    }, [itemStore.currentItem.type, itemStore.currentItem.label]);

    return (
        <Fragment>
            <DetailsHead
                type={itemStore.currentItem.type}
                name={itemStore.currentItem.name}
                title={t(`item-details.headline.${itemStore.currentItem.type}`, { label: itemStore.currentItem.label })}
            >
                <Detail hidden={!itemStore.currentItem.description}>{itemStore.currentItem.description}</Detail>
                <Detail>
                    <CopyTemplate
                        label={t("copy-template.rich-text-icon.label")}
                        template={`[${itemStore.currentItem.type}=${itemStore.currentItem.name}]`}
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

            <ItemRecipesList
                paginatedList={itemStore.paginatedProductRecipesList}
                headlineLocaleKey={"item-details.product-of"}
            />
            <ItemRecipesList
                paginatedList={itemStore.paginatedIngredientRecipesList}
                headlineLocaleKey={"item-details.ingredient-in"}
            />
        </Fragment>
    );
};

export default observer(ItemDetailsPage);
