import classNames from "classnames";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { createRef, useContext, useEffect } from "react";

import { iconManager } from "../../class/IconManager";
import { formatAmount } from "../../helper/format";
import TooltipStore from "../../store/TooltipStore";

import EntityLink from "../link/EntityLink";

import "./Icon.scss";

/**
 * Renders the element for the amount.
 * @param {number} amount
 * @returns {ReactNode}
 */
function renderAmount(amount) {
    if (amount <= 0) {
        return null;
    }

    return <span className="amount">{formatAmount(amount)}</span>;
}

/**
 * The component representing an item of an entity.
 * @param {string} type
 * @param {string} name
 * @param {number} amount
 * @param {boolean} transparent
 * @param {boolean} linked
 * @param {React.RefObject<HTMLElement>} ref
 * @returns {ReactNode}
 * @constructor
 */
const Icon = ({ type, name, amount = 0, transparent = false, linked = false }, ref) => {
    console.log("ICON REF", ref);
    const tooltipStore = useContext(TooltipStore);

    const classes = classNames({
        "icon": true,
        [`icon-${type}-${name}`.replace(" ", "_")]: true,
        "with-background": !transparent,
    });
    const label = renderAmount(amount);
    const iconRef = ref || createRef();

    useEffect(() => {
        iconManager.requestIcon(type, name);
    }, [type, name]);

    if (linked) {
        return (
            <EntityLink
                type={type}
                name={name}
                className={classes}
                ref={iconRef}
                onMouseEnter={async () => {
                    await tooltipStore.showTooltip(iconRef, type, name);
                }}
                onMouseLeave={() => {
                    tooltipStore.hideTooltip();
                }}
            >
                {label}
            </EntityLink>
        );
    }

    return (
        <div className={classes} ref={iconRef}>
            {label}
        </div>
    );
};

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.number,
    transparent: PropTypes.bool,
    linked: PropTypes.bool,
};

export default observer(Icon, { forwardRef: true });
