import classNames from "classnames";
import {observer} from "mobx-react-lite";
import React, {Fragment, useContext} from "react";
import {useMediaQuery} from 'react-responsive'

import {breakpointLarge} from "../../helper/const";
import SidebarStore from "../../store/SidebarStore";
import PinnedEntityList from "./sidebar/PinnedEntityList";
import SidebarCloseIcon from "./sidebar/SidebarCloseIcon";
import SidebarCloseOverlay from "./sidebar/SidebarCloseOverlay";
import UnpinnedEntityList from "./sidebar/UnpinnedEntityList";

import "./Sidebar.scss";
import PageStore from "../../store/PageStore";
import ItemStore from "../../store/ItemStore";

/**
 * The component representing the sidebar of the page.
 * @returns {ReactDOM}
 * @constructor
 */
const Sidebar = () => {
    const pageStore = useContext(PageStore);
    const sidebarStore = useContext(SidebarStore);
    const isMobile = useMediaQuery({maxWidth: breakpointLarge});

    const itemSore = useContext(ItemStore);

    const classes = classNames({
        "sidebar": true,
        "is-open": sidebarStore.isSidebarOpened,
    });

    if (pageStore.useBigHeader) {
        return null;
    }

    return (
        <Fragment>
            <div className={classes}>
                {isMobile ? <SidebarCloseIcon /> : null}
                <PinnedEntityList />
                <UnpinnedEntityList />

                <button
                    onClick={() => {
                        sidebarStore.addViewedEntity("fluid", "heavy-oil", "Schweröl");
                    }}
                >Press me</button>
                <button
                    onClick={() => {
                        sidebarStore.addViewedEntity("item", "stone-brick", "Steine-Dinger");
                    }}
                >Press me too</button>
                <button
                    onClick={async () => {
                        await itemSore.showItemDetails("item", "copper-cable");
                    }}
                >Item Details</button>
                <button
                    onClick={async () => {
                        await itemSore.showItemDetails("fluid", "light-oil");
                    }}
                >Item Details 2</button>
            </div>
            {isMobile ? <SidebarCloseOverlay /> : null}
        </Fragment>
    );
};

export default observer(Sidebar);
