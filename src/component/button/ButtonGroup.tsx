import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";

import "./ButtonGroup.scss";

type Props = {
    children: ReactNode;
    right?: boolean;
    spacing?: boolean;
};

/**
 * The component placing two buttons next to each other as a group.
 */
const ButtonGroup: FC<Props> = ({ right, spacing, children }) => {
    const classes = classNames({
        "button-group": true,
        "right": right,
        "spacing": spacing,
    });

    return <div className={classes}>{children}</div>;
};

export default observer(ButtonGroup);
