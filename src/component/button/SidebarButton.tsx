import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import Link from "../link/Link";

import "./Button.scss";
import "./SidebarButton.scss";

type Props = {
    label: string,
    route: string,
    params?: { [key: string]: any },
    icon: IconProp,
    primary?: boolean,
    secondary?: boolean,
    highlighted?: boolean,
};

/**
 * A button placed in the sidebar, adopting the spacing and sizes of the other sidebar elements.
 */
const SidebarButton: FC<Props> = ({ label, route, params, icon, primary, secondary, highlighted }) => {
    const classes = classNames({
        button: true,
        ["sidebar-button"]: true,
        primary: primary,
        secondary: secondary,
        highlighted: highlighted,
    });

    return (
        <Link className={classes} route={route} params={params}>
            <div className="link-icon">
                <FontAwesomeIcon icon={icon} />
            </div>
            <div className="label">{label}</div>
        </Link>
    );
};

export default observer(SidebarButton);
