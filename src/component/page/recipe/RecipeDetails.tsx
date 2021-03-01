import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { RecipeData } from "../../../type/transfer";
import { Breakpoint } from "../../../util/const";
import RecipeItemList from "./RecipeItemList";
import RecipeItemSeparator from "./RecipeItemSeparator";

import "./RecipeDetails.scss";

type Props = {
    recipe?: RecipeData;
};

/**
 * The component representing the recipe details.
 */
const RecipeDetails: FC<Props> = ({ recipe }) => {
    const isMedium = useMediaQuery({ minWidth: Breakpoint.Medium });
    const { t } = useTranslation();

    if (!recipe) {
        return null;
    }

    const classes = classNames({
        "recipe-details": true,
        "expensive": recipe.isExpensive,
    });

    return (
        <section className={classes}>
            <RecipeItemList
                headline={t("recipe-details.ingredients")}
                items={recipe.ingredients}
                craftingTime={recipe.craftingTime}
            />
            {isMedium ? <RecipeItemSeparator /> : null}
            <RecipeItemList headline={t("recipe-details.products")} items={recipe.products} />
        </section>
    );
};

export default observer(RecipeDetails);
