import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import "./TextBox.scss";

/**
 * The component representing a simple text box with some explanatory text.
 * @param {ReactDOM} children
 * @return {ReactDOM}
 * @constructor
 */
const TextBox = ({ children }) => {
    return <div className="text-box">{children}</div>;
};

TextBox.propTypes = {
    children: PropTypes.node.isRequired,
};

export default observer(TextBox);
