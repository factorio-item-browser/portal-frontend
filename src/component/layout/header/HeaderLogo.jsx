import React from "react";
import logo from "../../../image/logo.png"

import "./HeaderLogo.scss";

/**
 * The component representing the main header logo.
 * @returns {ReactDOM}
 * @constructor
 */
const HeaderLogo = () => {
    return (
        <div className="header-logo">
            <img src={logo} alt="Factorio Item Browser" />
        </div>
    );
};

export default HeaderLogo;
