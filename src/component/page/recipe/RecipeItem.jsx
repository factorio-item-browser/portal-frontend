import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import { formatAmount } from "../../../helper/format";
import Icon from "../../common/Icon";
import EntityLink from "../../link/EntityLink";

import "./RecipeItem.scss";

/**
 * The component representing exactly one item of the recipe details.
 * @param {RecipeItemData} item
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeItem = ({ item }) => {
    return (
        <EntityLink className="recipe-item" type={item.type} name={item.name}>
            <div className="amount">{formatAmount(item.amount)}</div>
            <Icon type={item.type} name={item.name} transparent={true} />
            <div className="label">
                {item.type}/{item.name}
            </div>
        </EntityLink>
    );
};

RecipeItem.propTypes = {
    item: PropTypes.object.isRequired,
};

export default observer(RecipeItem);
