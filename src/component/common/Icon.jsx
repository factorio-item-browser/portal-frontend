import classNames from "classnames";
import React from "react";
import PropTypes from "prop-types";
import {formatAmount} from "../../helper/format";

import "./Icon.scss";

/**
 * Creates the label for the amount.
 * @param {number} amount
 * @returns {ReactNode}
 */
function createLabel(amount) {
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
const Icon = ({type, name, amount = 0, transparent = true})  => {
    const classes = classNames({
        icon: true,
        [`icon-${type}-${name}`]: true,
        "with-background": !transparent,
    });
    const label = createLabel(amount);

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
