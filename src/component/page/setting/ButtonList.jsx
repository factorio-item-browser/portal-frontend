import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";

import "./ButtonList.scss";
import * as PropTypes from "prop-types";

/**
 * THe component representing a simple list of buttons.
 * @param {boolean} [right]
 * @param {ReactDOM} [children]
 * @return {ReactDOM}
 * @constructor
 */
const ButtonList = ({ right = false, children }) => {
    const classes = classNames({
        "button-list": true,
        "right": right,
    });

    return <div className={classes}>{children}</div>;
};

ButtonList.propTypes = {
    children: PropTypes.any,
    right: PropTypes.bool,
};

export default observer(ButtonList);
