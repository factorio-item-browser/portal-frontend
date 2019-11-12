import classNames from "classnames";
import React from "react";
import * as PropTypes from "prop-types";
import {formatAmount} from "../../helper/format";

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

    const formattedAmount = formatAmount(amount);
    return (
        <span className="amount">{formattedAmount}</span>
    );
}

/**
 * The component representing an item of an entity.
 * @param {string} type
 * @param {string} name
 * @param {number} amount
 * @param {boolean} transparent
 * @returns {ReactNode}
 * @constructor
 */
const Icon = ({type, name, amount = 0, transparent = false})  => {
    const classes = classNames({
        icon: true,
        [`icon-${type}-${name}`]: true,
        "with-background": !transparent,
    });
    const label = renderAmount(amount);

    return (
        <div className={classes}>{label}</div>
    );
};

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.number,
    transparent: PropTypes.bool,
};

export default Icon;
