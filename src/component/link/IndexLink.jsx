import * as PropTypes from "prop-types";
import React from "react";
import { observer } from "mobx-react-lite";

import { routeIndex } from "../../helper/const";
import Link from "./Link";

/**
 * The component representing a link to the index page.
 * @param {ReactDOM} children
 * @param {any} props
 * @returns {ReactDOM}
 * @constructor
 */
const IndexLink = ({ children, ...props }) => {
    return (
        <Link route={routeIndex} {...props}>
            {children}
        </Link>
    );
};

IndexLink.propTypes = {
    children: PropTypes.node.isRequired,
};

export default observer(IndexLink);
