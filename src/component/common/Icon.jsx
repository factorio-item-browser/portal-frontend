import classNames from "classnames";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, {useEffect} from "react";

import { formatAmount } from "../../helper/format";
import EntityLink from "../link/EntityLink";

import "./Icon.scss";
import { iconManager } from "../../class/IconManager";

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
 * @returns {ReactNode}
 * @constructor
 */
const Icon = ({ type, name, amount = 0, transparent = false, linked = false }) => {
    const classes = classNames({
        "icon": true,
        [`icon-${type}-${name}`.replace(" ", "_")]: true,
        "with-background": !transparent,
    });
    const label = renderAmount(amount);

    useEffect(() => {
        iconManager.requestIcon(type, name);
    }, [type, name]);

    if (linked) {
        return (
            <EntityLink type={type} name={name} className={classes}>
                {label}
            </EntityLink>
        );
    }

    return <div className={classes}>{label}</div>;
};

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.number,
    transparent: PropTypes.bool,
    linked: PropTypes.bool,
};

export default observer(Icon);
