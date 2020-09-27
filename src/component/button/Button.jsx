// @flow

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, IconDefinition } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";
import type { ElementRef } from "../../type/common";

import "./Button.scss";

type Props = {
    label: string,
    icon?: IconDefinition,
    primary?: boolean,
    secondary?: boolean,
    spacing?: boolean,
    onClick?: () => void | Promise<void>,
};

/**
 * The component representing a simple button to click on like there is no tomorrow.
 * @constructor
 */
const Button = ({ label, icon, primary, secondary, spacing, onClick }: Props, ref: ElementRef): React$Node => {
    const classes = classNames({
        button: true,
        primary: primary,
        secondary: secondary,
        spacing: spacing,
    });

    return (
        <div className={classes} ref={ref} onClick={onClick}>
            {icon ? <FontAwesomeIcon icon={icon} spin={icon === faSpinner} /> : null}
            {label}
        </div>
    );
};

export default (observer(Button, { forwardRef: true }): typeof Button);
