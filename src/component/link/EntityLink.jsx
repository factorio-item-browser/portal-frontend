import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { useContext } from "react";

import RouteStore from "../../store/RouteStore";
import Link from "./Link";

/**
 * The component representing a link to an entity.
 * @param {string} type
 * @param {string} name
 * @param {ReactDOM} children
 * @param {any} props
 * @returns {ReactDOM}
 * @constructor
 */
const EntityLink = ({ type, name, children, ...props }) => {
    const routeStore = useContext(RouteStore);
    const { route, params } = routeStore.getRouteAndParamsForEntity(type, name);

    return (
        <Link route={route} params={params} {...props}>
            {children}
        </Link>
    );
};

EntityLink.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default observer(EntityLink);
