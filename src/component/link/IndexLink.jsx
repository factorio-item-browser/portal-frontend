import * as PropTypes from "prop-types";
import React from "react";
import { observer } from "mobx-react-lite";

import { ROUTE_INDEX } from "../../const/route";
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
        <Link route={ROUTE_INDEX} {...props}>
            {children}
        </Link>
    );
};

IndexLink.propTypes = {
    children: PropTypes.node.isRequired,
};

export default observer(IndexLink);
