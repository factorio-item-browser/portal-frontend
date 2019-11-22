import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";

import { breakpointLarge } from "../../helper/const";
import RouteStore from "../../store/RouteStore";
import SearchStore from "../../store/SearchStore";

import HeaderLogo from "./header/HeaderLogo";
import HeaderSearch from "./header/HeaderSearch";
import SidebarIcon from "./header/SidebarIcon";
import SearchIcon from "./header/SearchIcon";

import "./Header.scss";

/**
 * The component representing the header of the page.
 * @returns {ReactNode}
 * @constructor
 */
const Header = () => {
    const routeStore = useContext(RouteStore);
    const searchStore = useContext(SearchStore);
    const isMobile = useMediaQuery({ maxWidth: breakpointLarge });

    // Index page with big logo and search box.
    if (routeStore.useBigHeader) {
        return (
            <header className="big">
                <HeaderLogo />
                <HeaderSearch />
            </header>
        );
    }

    // Desktop version with logo and search.
    if (!isMobile) {
        return (
            <header>
                <HeaderLogo />
                <HeaderSearch />
            </header>
        );
    }

    // Opened search replaces header on mobile.
    if (searchStore.isSearchOpened) {
        return (
            <header>
                <HeaderSearch />
            </header>
        );
    }

    // Closed search means icons and logo on mobile.
    return (
        <header>
            <SidebarIcon />
            <HeaderLogo />
            <SearchIcon />
        </header>
    );
};

export default observer(Header);
