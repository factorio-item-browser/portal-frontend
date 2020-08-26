// @flow

import { observer } from "mobx-react-lite";
import React, { createRef } from "react";
import type { RecipeItemData } from "../../../type/transfer";
import { formatAmount } from "../../../util/format";
import { useTooltip } from "../../../util/hooks";
import Icon from "../../common/Icon";
import EntityLink from "../../link/EntityLink";

import "./RecipeItem.scss";

type Props = {
    item: RecipeItemData,
};

/**
 * The component representing exactly one item of the recipe details.
 * @constructor
 */
const RecipeItem = ({ item }: Props): React$Node => {
    const iconRef = createRef();
    const { showTooltip, hideTooltip } = useTooltip(item.type, item.name, iconRef);

    return (
        <EntityLink
            className="recipe-item"
            type={item.type}
            name={item.name}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            <div className="amount">{formatAmount(item.amount)}</div>
            <Icon type={item.type} name={item.name} transparent={true} ref={iconRef} />
            <div className="label">{item.label}</div>
        </EntityLink>
    );
};

export default (observer(RecipeItem): typeof RecipeItem);
