import { observer } from "mobx-react-lite";
import React  from "react";

import "./OptionsList.scss";
import * as PropTypes from "prop-types";

/**
 * The component representing the list of additional options to a setting.
 * @param {ReactDOM} children
 * @return {ReactDOM}
 * @constructor
 */
const OptionsList = ({ children }) => {
    return (
        <div className="options-list">
            {children}
        </div>
    );
};

Option.propTypes = {
    children: PropTypes.any.isRequired,
};

export default observer(OptionsList);
