import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import Link from "../link/Link";

import "./Button.scss";

type Props = {
    label: string;
    route: string;
    params?: { [key: string]: any };
    icon?: IconProp;
    primary?: boolean;
    secondary?: boolean;
    spacing?: boolean;
};

const LinkedButton: FC<Props> = ({ label, route, params, icon, primary, secondary, spacing }) => {
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

export default observer(LinkedButton);
