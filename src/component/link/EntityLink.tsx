import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";
import { getRouteAndParamsForEntity } from "../../util/route";
import Link from "./Link";

type Props = {
    type: string;
    name: string;
    children?: ReactNode;
    [key: string]: any;
};

/**
 * The component representing a link to an entity.
 */
const EntityLink: FC<Props> = ({ type, name, children, ...props }, ref) => {
    const { route, params } = getRouteAndParamsForEntity(type, name);

    return (
        <Link {...props} route={route} params={params} ref={ref}>
            {children}
        </Link>
    );
};

export default observer(EntityLink, { forwardRef: true });
