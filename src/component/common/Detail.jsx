import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

/**
 * The component representing an additional detail of a details head.
 * @param {ReactDOM} children
 * @param {boolean} hidden
 * @returns {ReactDOM|null}
 * @constructor
 */
const Detail = ({ children, hidden }) => {
    if (hidden) {
        return null;
    }

    return <div className="detail">{children}</div>;
};

Detail.propTypes = {
    children: PropTypes.node,
    hidden: PropTypes.bool,
};

export default observer(Detail);
