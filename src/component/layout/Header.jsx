import {observer} from "mobx-react-lite";
import React, {useContext} from "react";
import {useMediaQuery} from "react-responsive";

import {breakpointLarge} from "../../helper/const";
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
    const isMobile = useMediaQuery({maxWidth: breakpointLarge});
    const searchStore = useContext(SearchStore);

    if (isMobile) {
        if (searchStore.isOpened) {
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
    }

    return (
        <header>
            <HeaderLogo />
            <HeaderSearch />
        </header>
    );
};

export default observer(Header);
