// @flow

import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";
import type { ElementRef } from "../../type/common";
import { formatIconClass } from "../../util/format";
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
    const classes = classNames({
        icon: true,
        [formatIconClass(type, name)]: true,
    });
    useIcon(type, name);

    return <div className={classes} ref={ref} />;
};

export default (observer(Icon, { forwardRef: true }): typeof Icon);
