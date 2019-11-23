import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import RecipeItem from "./RecipeItem";

import "./RecipeItemList.scss";

/**
 * The component representing a list of items on the recipe details page.
 * @param {string} headline
 * @param {RecipeItemData[]} items
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeItemList = ({ headline, items }) => {
    return (
        <div className="recipe-item-list">
            <h3>{headline}</h3>
            {items.map((item) => {
                return <RecipeItem key={`${item.type}-${item.name}`} item={item} />;
            })}
        </div>
    );
};

RecipeItemList.propTypes = {
    headline: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
};

export default observer(RecipeItemList);
