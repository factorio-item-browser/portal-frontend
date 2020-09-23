// @flow

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, IconDefinition } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";

import "./Option.scss";

type Props = {
    label: string,
    description?: string,
    children: React$Node,
    fullWidth?: boolean,
    error?: boolean,
    icon?: IconDefinition,
};

/**
 * The component representing an option of the setting.
 * @constructor
 */
const Option = ({ label, description, children, fullWidth, error, icon }: Props): React$Node => {
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

export default (observer(Option): typeof Option);
