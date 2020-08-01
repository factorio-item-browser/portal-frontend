import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { useContext } from "react";

import { routeStoreContext } from "../../store/RouteStore";
import Link from "./Link";

/**
 * The component representing a link to an entity.
 * @param {string} type
 * @param {string} name
 * @param {ReactDOM} children
 * @param {any} props
 * @param {React.RefObject<HTMLElement>} ref
 * @returns {ReactDOM}
 * @constructor
 */
const EntityLink = ({ type, name, children, ...props }, ref) => {
    const routeStore = useContext(routeStoreContext);
    const { route, params } = routeStore.getRouteAndParamsForEntity(type, name);

    return (
        <Link route={route} params={params} {...props} ref={ref}>
            {children}
        </Link>
    );
};

EntityLink.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default observer(EntityLink, { forwardRef: true });
