// @flow

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, IconDefinition } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";
import Link from "../link/Link";

import "./Button.scss";

type Props = {
    label: string,
    route: string,
    params?: { [string]: any },
    icon?: IconDefinition,
    primary?: boolean,
    secondary?: boolean,
    spacing?: boolean,
};

const LinkedButton = ({ label, route, params, icon, primary, secondary, spacing }: Props): React$Node => {
    const classes = classNames({
        button: true,
        primary: primary,
        secondary: secondary,
        spacing: spacing,
    });

    return (
        <Link className={classes} route={route} params={params}>
            {icon ? <FontAwesomeIcon icon={icon} spin={icon === faSpinner} /> : null}
            {label}
        </Link>
    );
};

export default (observer(LinkedButton): typeof LinkedButton);