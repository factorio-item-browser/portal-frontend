import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { ForwardRefRenderFunction, useEffect } from "react";
import { modIconManager } from "../../class/IconManager";
import { formatIconClass } from "../../util/format";

import "./Icon.scss";

type Props = {
    combinationId: string;
    name: string;
};

/**
 * The component representing a mod icon.
 */
const ModIcon: ForwardRefRenderFunction<HTMLDivElement, Props> = ({ combinationId, name }, ref) => {
    useEffect((): void => {
        modIconManager.requestIcon(combinationId, name);
    }, [combinationId, name]);

    const classes = classNames({
        icon: true,
        [formatIconClass("mod", name)]: true,
    });

    return <div className={classes} ref={ref} />;
};

export default observer(ModIcon, { forwardRef: true });
