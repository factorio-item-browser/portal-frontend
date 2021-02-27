import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import logo from "../../../image/logo.png";
import IndexLink from "../../link/IndexLink";

import "./HeaderLogo.scss";

/**
 * The component representing the main header logo.
 */
const HeaderLogo: FC = () => {
    return (
        <IndexLink className="header-logo">
            <img src={logo} alt="Factorio Item Browser" />
        </IndexLink>
    );
};

export default observer(HeaderLogo);
