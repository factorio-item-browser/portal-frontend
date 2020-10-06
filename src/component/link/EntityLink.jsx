// @flow

import { observer } from "mobx-react-lite";
import React from "react";
import type { ElementRef } from "../../type/common";
import { getRouteAndParamsForEntity } from "../../util/route";
import Link from "./Link";

type Props = {
    type: string,
    name: string,
    children?: React$Node,
    ...
};

/**
 * The component representing a link to an entity.
 * @constructor
 */
const EntityLink = ({ type, name, children, ...props }: Props, ref: ElementRef) => {
    const { route, params } = getRouteAndParamsForEntity(type, name);

    return (
        <Link {...props} route={route} params={params} ref={ref}>
            {children}
        </Link>
    );
};

export default (observer(EntityLink, { forwardRef: true }): typeof EntityLink);
