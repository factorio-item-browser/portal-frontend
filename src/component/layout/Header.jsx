import {observer} from "mobx-react-lite";
import React, {useContext} from "react";
import {useMediaQuery} from "react-responsive";

import {breakpointLarge} from "../../helper/const";
import SearchStore from "../../store/SearchStore";

import HeaderLogo from "./header/HeaderLogo";
import HeaderSearch from "./header/HeaderSearch";
import PageStore from "../../store/PageStore";
import SidebarIcon from "./header/SidebarIcon";
import SearchIcon from "./header/SearchIcon";

import "./Header.scss";

/**
 * The component representing the header of the page.
 * @returns {ReactNode}
 * @constructor
 */
const Header = () => {
    const pageStore = useContext(PageStore);
    const searchStore = useContext(SearchStore);
    const isMobile = useMediaQuery({maxWidth: breakpointLarge});

    if (pageStore.useBigHeader) {
        return (
            <header className="big">
                <HeaderLogo />
                <HeaderSearch />
            </header>
        );
    }

    if (!isMobile) {
        return (
            <header>
                <HeaderLogo />
                <HeaderSearch />
            </header>
        );
    }

    if (searchStore.isSearchOpened) {
        return (
            <header>
                <HeaderSearch />
            </header>
        );
    }

    return (
        <header>
            <SidebarIcon />
            <HeaderLogo />
            <SearchIcon />
        </header>
    );
};

export default observer(Header);
