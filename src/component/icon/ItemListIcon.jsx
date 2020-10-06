// @flow

import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { createRef } from "react";
import { useIcon, useTooltip } from "../../util/hooks";
import EntityLink from "../link/EntityLink";

import "./Icon.scss";

type Props = {
    type: string,
    name: string,
};

/**
 * The component representing an item as icon in the list.
 * @constructor
 */
const ItemListIcon = ({ type, name }: Props): React$Node => {
    const iconRef = createRef();
    const { showTooltip, hideTooltip } = useTooltip(type, name, iconRef);
    const iconClass = useIcon(type, name);

    const classes = classNames({
        icon: true,
        large: true,
        [iconClass]: true,
    });

    return (
        <EntityLink
            className={classes}
            type={type}
            name={name}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            ref={iconRef}
        />
    );
};

export default (observer(ItemListIcon): typeof ItemListIcon);
