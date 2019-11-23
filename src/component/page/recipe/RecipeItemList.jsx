import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import RecipeItem from "./RecipeItem";
import RecipeItemTime from "./RecipeItemTime";

import "./RecipeItemList.scss";

/**
 * The component representing a list of items on the recipe details page.
 * @param {string} headline
 * @param {RecipeItemData[]} items
 * @param {number} [craftingTime]
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeItemList = ({ headline, items, craftingTime = 0 }) => {
    return (
        <div className="recipe-item-list">
            <h3>{headline}</h3>
            {craftingTime > 0 ? <RecipeItemTime craftingTime={craftingTime} /> : null}
            {items.map((item) => {
                return <RecipeItem key={`${item.type}-${item.name}`} item={item} />;
            })}
        </div>
    );
};

RecipeItemList.propTypes = {
    headline: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    craftingTime: PropTypes.number,
};

export default observer(RecipeItemList);
