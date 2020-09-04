// @flow

import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";

import "./ButtonGroup.scss";

type Props = {
    children: React$Node,
    right?: boolean,
    spacing?: boolean,
};

/**
 * The component placing two buttons next to each other as a group.
 * @constructor
 */
const ButtonGroup = ({ right, spacing, children }: Props): React$Node => {
    const classes = classNames({
        "button-group": true,
        "right": right,
        "spacing": spacing,
    });

    return <div className={classes}>{children}</div>;
};

export default (observer(ButtonGroup): typeof ButtonGroup);
