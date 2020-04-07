import classNames from "classnames";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import Link from "./Link";

import "../common/Button.scss";

/**
 * THe component representing a link as button.
 * @param {boolean} [primary]
 * @param {boolean} [secondary]
 * @param {boolean} [spacing]
 * @param {string} [className]
 * @param {ReactDOM} children
 * @param {any} props
 * @return {ReactDOM}
 * @constructor
 */
const ButtonLink = ({ primary, secondary, spacing, className, children, ...props }) => {
    const additionalClasses = {};
    if (typeof className === "string") {
        for (const name of className.split(" ")) {
            additionalClasses[name] = true;
        }
    }

    const classes = classNames({
        button: true,
        primary: primary,
        secondary: secondary,
        spacing: spacing,
        ...additionalClasses,
    });

    return (
        <Link className={classes} {...props}>
            {children}
        </Link>
    );
};

ButtonLink.propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    spacing: PropTypes.bool,
};

export default observer(ButtonLink);
