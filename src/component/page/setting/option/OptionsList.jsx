import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import "./OptionsList.scss";

/**
 * The component representing the list of additional options to a setting.
 * @param {ReactDOM} children
 * @return {ReactDOM}
 * @constructor
 */
const OptionsList = ({ children }) => {
    return <div className="options-list">{children}</div>;
};

OptionsList.propTypes = {
    children: PropTypes.any.isRequired,
};

export default observer(OptionsList);
