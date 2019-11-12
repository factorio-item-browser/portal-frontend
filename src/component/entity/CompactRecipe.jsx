import classNames from "classnames";
import * as PropTypes from "prop-types";
import React from "react";
import CompactRecipeSeparator from "./CompactRecipeSeparator";
import Icon from "../common/Icon";

import "./CompactRecipe.scss";

/**
 * Renders a single item of the recipe.
 * @param {RecipeItem} item
 * @returns {ReactDOM}
 */
function renderItem(item) {
    return (
        <Icon
            key={`${item.type}/${item.name}`}
            type={item.type}
            name={item.name}
            amount={item.amount}
            transparent={false}
        />
    );
}

/**
 * The component representing one compact recipe of an entity.
 * @param {Recipe} recipe
 * @param {boolean} isExpensive
 * @returns {ReactNode}
 * @constructor
 */
const CompactRecipe = ({recipe, isExpensive = false}) => {
    const classes = classNames({
        "compact-recipe": true,
        "expensive": isExpensive,
    });

    let expensiveLabel = null;
    if (isExpensive) {
        expensiveLabel = (
            <span className="mode">expensive version</span>
        );
    }

    return (
        <div className={classes}>
            {recipe.ingredients.map(renderItem)}
            <CompactRecipeSeparator craftingTime={recipe.craftingTime} />
            {recipe.products.map(renderItem)}
            {expensiveLabel}
        </div>
    );
};

CompactRecipe.propTypes = {
    recipe: PropTypes.object.isRequired,
    isExpensive: PropTypes.bool,
};

export default CompactRecipe;
