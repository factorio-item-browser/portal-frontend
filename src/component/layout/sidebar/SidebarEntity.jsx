import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack, faTrash } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import Icon from "../../common/Icon";
import SidebarStore from "../../../store/SidebarStore";

import "./SidebarEntity.scss";
import EntityLink from "../../link/EntityLink";

/**
 * Renders the action to pin the entity.
 * @param {SidebarEntityData} entity
 * @returns {ReactDOM}
 */
function renderPinAction(entity) {
    const { t } = useTranslation();
    const sidebarStore = useContext(SidebarStore);

    return (
        <div
            className="action"
            title={t("sidebar.action-pin")}
            onClick={(event) => {
                sidebarStore.pinEntity(entity);
                event.preventDefault();
            }}
        >
            <FontAwesomeIcon icon={faThumbtack} />
        </div>
    );
}

/**
 * Renders the action to un pin the entity.
 * @param {SidebarEntityData} entity
 * @returns {ReactDOM}
 */
function renderUnpinAction(entity) {
    const { t } = useTranslation();
    const sidebarStore = useContext(SidebarStore);

    return (
        <div
            className="action"
            title={t("sidebar.action-unpin")}
            onClick={(event) => {
                sidebarStore.unpinEntity(entity);
                event.preventDefault();
                event.stopPropagation();
            }}
        >
            <FontAwesomeIcon icon={faTrash} />
        </div>
    );
}

/**
 * The component representing a single entity in the sidebar.
 * @param {SidebarEntityData} entity
 * @returns {ReactDOM}
 * @constructor
 */
const SidebarEntity = ({ entity }) => {
    const { t } = useTranslation();
    const sidebarStore = useContext(SidebarStore);

    return (
        <EntityLink
            type={entity.type}
            name={entity.name}
            className="sidebar-entity"
            draggable={true}
            data-id={sidebarStore.getIdForEntity(entity)}
        >
            <Icon type={entity.type} name={entity.name} transparent={true} />
            <span className="label">{entity.label}</span>

            {entity.pinnedPosition > 0 ? renderUnpinAction(entity) : renderPinAction(entity)}
            <div className="type">{t(`box-label.${entity.type}`)}</div>
        </EntityLink>
    );
};

SidebarEntity.propTypes = {
    entity: PropTypes.object.isRequired,
};

export default observer(SidebarEntity);
