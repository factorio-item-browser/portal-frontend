import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";

import "./Button.scss";
import * as PropTypes from "prop-types";

/**
 * The component representing a simple button to click on like there is no tomorrow.
 * @param {boolean} [primary]
 * @param {boolean} [secondary]
 * @param {boolean} [spacing]
 * @param {string} [className]
 * @param {ReactDOM} children
 * @param {any} props
 * @param {React.RefObject<HTMLElement>} ref
 * @return {ReactDOM}
 * @constructor
 */
const Button = ({ primary, secondary, spacing, className, children, ...props }, ref) => {
    const classes = classNames(className, {
        button: true,
        primary: primary,
        secondary: secondary,
        spacing: spacing,
    });

    return (
        <div className={classes} {...props} ref={ref}>
            {children}
        </div>
    );
};

Button.propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    spacing: PropTypes.bool,
};

export default observer(Button, { forwardRef: true });
