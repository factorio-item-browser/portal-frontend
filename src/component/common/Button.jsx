// @flow

import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";

import "./Button.scss";

type Props = {
    primary?: boolean,
    secondary?: boolean,
    spacing?: boolean,
    sticky?: boolean,
    className?: string,
    children: React$Node,
    ...
};

/**
 * The component representing a simple button to click on like there is no tomorrow.
 * @constructor
 */
const Button = (
    { primary, secondary, spacing, sticky, className, children, ...props }: Props,
    ref: React$Ref<any>
): React$Node => {
    const classes = classNames(className, {
        button: true,
        primary: primary,
        secondary: secondary,
        spacing: spacing,
        sticky: sticky,
    });

    return (
        <div {...props} className={classes} ref={ref}>
            {children}
        </div>
    );
};

export default (observer(Button, { forwardRef: true }): typeof Button);
