import {observer} from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, {useContext} from "react";

import RouteStore from "../../store/RouteStore";

/**
 * The component representing a link to an entity.
 * @param {string} type
 * @param {string} name
 * @param {ReactDOM} children
 * @param {any} props
 * @returns {ReactDOM}
 * @constructor
 */
const EntityLink = ({type, name, children, ...props}) => {
    const routeStore = useContext(RouteStore);

    return (
        <a
            href={routeStore.buildPathToEntity(type, name)}
            {...props}
            onClick={(event) => {
                event.preventDefault();
                routeStore.navigateToEntity(type, name);
            }}
        >
            {children}
        </a>
    );
};

EntityLink.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default observer(EntityLink);
