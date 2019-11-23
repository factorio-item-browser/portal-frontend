import classNames from "classnames";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import { breakpointMedium } from "../../../helper/const";
import RecipeItemList from "./RecipeItemList";
import RecipeItemSeparator from "./RecipeItemSeparator";

import "./RecipeDetails.scss";

/**
 * The component representing the recipe details.
 * @param {RecipeData} recipe
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeDetails = ({ recipe }) => {
    const isMedium = useMediaQuery({ minWidth: breakpointMedium });
    const { t } = useTranslation();
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

RecipeDetails.propTypes = {
    recipe: PropTypes.object.isRequired,
};

export default observer(RecipeDetails);
