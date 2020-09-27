// @flow

import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";
import type { ElementRef } from "../../type/common";
import { useIcon } from "../../util/hooks";

import "./Icon.scss";

type Props = {
    type: string,
    name: string,
};

/**
 * The component representing an icon without any additional features.
 * @constructor
 */
const Icon = ({ type, name }: Props, ref?: ElementRef): React$Node => {
    const iconClass = useIcon(type, name);

    const classes = classNames({
        icon: true,
        [iconClass]: true,
    });

    return <div className={classes} ref={ref} />;
};

export default (observer(Icon, { forwardRef: true }): typeof Icon);
