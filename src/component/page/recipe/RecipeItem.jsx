import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { createRef, useContext } from "react";
import { Formatter } from "../../../class/Formatter";
import { tooltipStoreContext } from "../../../store/TooltipStore";
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
    const tooltipStore = useContext(tooltipStoreContext);
    const iconRef = createRef();

    return (
        <EntityLink
            className="recipe-item"
            type={item.type}
            name={item.name}
            onMouseEnter={async () => {
                await tooltipStore.showTooltip(iconRef, item.type, item.name);
            }}
            onMouseLeave={() => {
                tooltipStore.hideTooltip();
            }}
        >
            <div className="amount">{Formatter.formatAmount(item.amount)}</div>
            <Icon type={item.type} name={item.name} transparent={true} ref={iconRef} />
            <div className="label">{item.label}</div>
        </EntityLink>
    );
};

RecipeItem.propTypes = {
    item: PropTypes.object.isRequired,
};

export default observer(RecipeItem);
