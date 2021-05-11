import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";

import "./Option.scss";

type Props = {
    label: string;
    description?: string | ReactNode;
    children: ReactNode;
    fullWidth?: boolean;
    error?: boolean;
    icon?: IconProp;
};

/**
 * The component representing an option of the setting.
 */
const Option: FC<Props> = ({ label, description, children, fullWidth, error, icon }) => {
    const classes = classNames({
        "option": true,
        "error": error,
        "full-width": fullWidth,
    });

    let chevron = null;
    if (icon) {
        chevron = (
            <div className="chevron">
                <FontAwesomeIcon icon={icon} spin={icon === faSpinner} />
            </div>
        );
    }

    return (
        <div className={classes}>
            <div className="head">
                <h3>{label}</h3>
                <div className="input">
                    {children}
                    {chevron}
                </div>
            </div>
            {description ? <div className="description">{description}</div> : null}
        </div>
    );
};

export default observer(Option);
