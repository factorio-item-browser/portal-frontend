import { observer } from "mobx-react-lite";
import React, { FC, Fragment, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ERROR_PAGE_NOT_FOUND } from "../../const/error";
import { itemStoreContext } from "../../store/ItemStore";
import { useDocumentTitle } from "../../util/hooks";
import CopyTemplate from "../common/CopyTemplate";
import Detail from "../common/Detail";
import DetailsHead from "../common/DetailsHead";
import ErrorBox from "../error/ErrorBox";
import ItemRecipesList from "./item/ItemRecipesList";

/**
 * The component representing the item and fluid details page.
 */
const ItemDetailsPage: FC = () => {
    const itemStore = useContext(itemStoreContext);
    const { t } = useTranslation();
    const item = itemStore.currentItem;

    useDocumentTitle(item.label ? `item-details.title.${item.type}` : "", { label: item.label });

    if (itemStore.hasNotFoundError) {
        return <ErrorBox type={ERROR_PAGE_NOT_FOUND} />;
    }

    return (
        <Fragment>
            <DetailsHead
                type={item.type}
                name={item.name}
                title={t(`item-details.headline.${item.type}`, { label: item.label })}
            >
                <Detail hidden={!item.description}>{item.description}</Detail>
                <Detail>
                    <CopyTemplate
                        label={t("copy-template.rich-text-icon.label")}
                        template={`[${item.type}=${item.name}]`}
                        description={t("copy-template.rich-text-icon.description")}
                    />
                </Detail>
                <Detail hidden={item.type !== "item"}>
                    <CopyTemplate
                        label={t("copy-template.cheat-command.label")}
                        template={`/c game.player.insert{ name="${item.name}", count=10 }`}
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
