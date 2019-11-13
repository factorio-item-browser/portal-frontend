import React, {useContext} from "react";
import {observer} from "mobx-react-lite";
import Sortable from "react-sortablejs";
import {useTranslation} from "react-i18next";

import SidebarStore from "../../../store/SidebarStore";
import SidebarEntity from "./SidebarEntity";

import "./SidebarList.scss";

/**
 * The component representing the list of pinned entities in the sidebar.
 * @returns {ReactDOM|null}
 * @constructor
 */
const PinnedEntityList = () => {
    const { t } = useTranslation();
    const sidebarStore = useContext(SidebarStore);
    const sortableOptions = {
        group: {
            name: "sidebar-entities",
            pull: false,
            put: true,
        },
        draggable: ".sidebar-entity",
        animation: 100,
    };
    const entities = sidebarStore.pinnedEntities;

    if (entities.length === 0) {
        return null;
    }

    return (
        <Sortable className="sidebar-list" options={sortableOptions} onChange={(order) => {
            sidebarStore.updatePinnedOrder(order);
        }}>
            <h3>{t("sidebar.headline-pinned")}</h3>
            {entities.map((entity) => {
                return (
                    <SidebarEntity
                        key={sidebarStore.getIdForEntity(entity)}
                        entity={entity}
                    />
                );
            })}
        </Sortable>
    );
};

export default observer(PinnedEntityList);
