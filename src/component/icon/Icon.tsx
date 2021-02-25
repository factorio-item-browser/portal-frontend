import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useIcon } from "../../util/hooks";

import "./Icon.scss";

type Props = {
    type: string,
    name: string,
};

/**
 * The component representing an icon without any additional features.
 */
const Icon: FC<Props> = ({ type, name }, ref) => {
    const iconClass = useIcon(type, name);

    const classes = classNames({
        icon: true,
        [iconClass]: true,
    });

    return <div className={classes} ref={ref} />;
};

export default observer(Icon, { forwardRef: true });
