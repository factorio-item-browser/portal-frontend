import { observer } from "mobx-react-lite";
import React from "react";

import logo from "../../../image/logo.png";

import "./HeaderLogo.scss";
import IndexLink from "../../link/IndexLink";

/**
 * The component representing the main header logo.
 * @returns {ReactDOM}
 * @constructor
 */
const HeaderLogo = () => {
    return (
        <IndexLink className="header-logo">
            <img src={logo} alt="Factorio Item Browser" />
        </IndexLink>
    );
};

export default observer(HeaderLogo);
