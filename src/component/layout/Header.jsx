// @flow

import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINT_LARGE } from "../../const/breakpoint";
import { routeStoreContext } from "../../store/RouteStore";
import { searchStoreContext } from "../../store/SearchStore";
import HeaderLogo from "./header/HeaderLogo";
import HeaderSearch from "./header/HeaderSearch";
import SearchIcon from "./header/SearchIcon";
import SettingsLink from "./header/SettingsLink";
import SidebarIcon from "./header/SidebarIcon";

import "./Header.scss";

/**
 * The component representing the header of the page.
 * @constructor
 */
const Header = (): React$Node => {
    const routeStore = useContext(routeStoreContext);
    const searchStore = useContext(searchStoreContext);
    const isLarge = useMediaQuery({ minWidth: BREAKPOINT_LARGE });

    // Index page with big logo and search box.
    if (routeStore.useBigHeader) {
        return (
            <header className="big">
                <HeaderLogo />
                <HeaderSearch />
                <SettingsLink />
            </header>
        );
    }

    // Desktop version with logo and search.
    if (isLarge) {
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

export default (observer(Header): typeof Header);
