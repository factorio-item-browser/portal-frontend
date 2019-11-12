import React from "react";
import HeaderLogo from "./header/HeaderLogo";
import HeaderSearch from "./header/HeaderSearch";

import "./Header.scss";

/**
 * The component representing the header of the page.
 * @returns {ReactNode}
 * @constructor
 */
const Header = () => {
    return (
        <header>
            <HeaderLogo />
            <HeaderSearch />
        </header>
    );
};

export default Header;
