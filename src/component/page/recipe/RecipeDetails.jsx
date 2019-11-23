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
 * @param {RecipeItemData[]} ingredients
 * @param {RecipeItemData[]} products
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeDetails = ({ ingredients, products }) => {
    const isMedium = useMediaQuery({ minWidth: breakpointMedium });
    const { t } = useTranslation();

    return (
        <section className="recipe-details">
            <RecipeItemList headline={t("recipe-details.ingredients")} items={ingredients} />
            {isMedium ? <RecipeItemSeparator /> : null}
            <RecipeItemList headline={t("recipe-details.products")} items={products} />
        </section>
    );
};

RecipeDetails.propTypes = {
    ingredients: PropTypes.array.isRequired,
    products: PropTypes.array.isRequired,
};

export default observer(RecipeDetails);
