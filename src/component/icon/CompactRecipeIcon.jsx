// @flow

import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { createRef, useContext } from "react";
import { itemStoreContext } from "../../store/ItemStore";
import type { ElementRef } from "../../type/common";
import { formatAmount, formatIconClass } from "../../util/format";
import { useIcon, useTooltip } from "../../util/hooks";
import EntityLink from "../link/EntityLink";

import "./CompactRecipeIcon.scss";

type Props = {
    type: string,
    name: string,
    amount: number,
};

/**
 * The component representing an icon in a compact recipe, including an amount and a background.
 * @constructor
 */
const CompactRecipeIcon = ({ type, name, amount }: Props, ref: ?ElementRef): React$Node => {
    const itemStore = useContext(itemStoreContext);
    const iconRef = ref || createRef();
    const { showTooltip, hideTooltip } = useTooltip(type, name, iconRef);

    const classes = classNames({
        "compact-recipe-icon": true,
        [formatIconClass(type, name)]: true,
        "highlighted": itemStore.highlightedEntity.type === type && itemStore.highlightedEntity.name === name,
    });
    useIcon(type, name);

    return (
        <EntityLink
            className={classes}
            type={type}
            name={name}
            ref={iconRef}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            <span className="amount">{formatAmount(amount)}</span>
        </EntityLink>
    );
};

export default (observer(CompactRecipeIcon, { forwardRef: true }): typeof CompactRecipeIcon);
