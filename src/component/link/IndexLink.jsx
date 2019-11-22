import * as PropTypes from "prop-types";
import React, {useContext} from "react";
import {observer} from "mobx-react-lite";

import {routeIndex} from "../../helper/const";
import RouteStore from "../../store/RouteStore";

/**
 * The component representing a link to the index page.
 * @param {ReactDOM} children
 * @param {any} props
 * @returns {ReactDOM}
 * @constructor
 */
const IndexLink = ({children, ...props}) => {
    const routeStore = useContext(RouteStore);

    return (
        <a
            href={routeStore.buildPath(routeIndex)}
            {...props}
            onClick={(event) => {
                event.preventDefault();
                routeStore.navigateTo(routeIndex);
            }}
        >
            {children}
        </a>
    );
};

IndexLink.propTypes = {
    children: PropTypes.node.isRequired,
};

export default observer(IndexLink);
