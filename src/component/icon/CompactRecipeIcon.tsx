import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { ForwardRefRenderFunction, RefObject, useContext, useRef } from "react";
import { itemStoreContext } from "../../store/ItemStore";
import { formatAmount } from "../../util/format";
import { useIcon, useTooltip } from "../../util/hooks";
import EntityLink from "../link/EntityLink";

import "./CompactRecipeIcon.scss";

type Props = {
    type: string;
    name: string;
    amount: number;
};

/**
 * The component representing an icon in a compact recipe, including an amount and a background.
 */
const CompactRecipeIcon: ForwardRefRenderFunction<HTMLAnchorElement, Props> = ({ type, name, amount }, ref) => {
    const itemStore = useContext(itemStoreContext);

    let iconRef: RefObject<HTMLAnchorElement>;
    if (ref && "current" in ref) {
        iconRef = ref;
    } else {
        iconRef = useRef<HTMLAnchorElement>(null);
    }

    const { showTooltip, hideTooltip } = useTooltip(type, name, iconRef);
    const iconClass = useIcon(type, name);

    const classes = classNames({
        "compact-recipe-icon": true,
        [iconClass]: true,
        "highlighted": itemStore.highlightedEntity.type === type && itemStore.highlightedEntity.name === name,
    });

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

export default observer(CompactRecipeIcon, { forwardRef: true });
