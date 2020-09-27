import { faThumbtack, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { createRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { sidebarStoreContext } from "../../../store/SidebarStore";
import { tooltipStoreContext } from "../../../store/TooltipStore";
import Icon from "../../icon/Icon";
import EntityLink from "../../link/EntityLink";

import "./SidebarEntity.scss";

/**
 * Renders the action to pin the entity.
 * @param {SidebarEntityData} entity
 * @returns {ReactDOM}
 */
function renderPinAction(entity) {
    const { t } = useTranslation();
    const sidebarStore = useContext(sidebarStoreContext);

    return (
        <div
            className="action"
            title={t("sidebar.action-pin")}
            onClick={(event) => {
                sidebarStore.pinEntity(entity);
                event.preventDefault();
                event.stopPropagation();
                return false;
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
    const sidebarStore = useContext(sidebarStoreContext);

    return (
        <div
            className="action"
            title={t("sidebar.action-unpin")}
            onClick={(event) => {
                sidebarStore.unpinEntity(entity);
                event.preventDefault();
                event.stopPropagation();
                return false;
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
    const sidebarStore = useContext(sidebarStoreContext);
    const tooltipStore = useContext(tooltipStoreContext);

    const iconRef = createRef();
    const entityId = sidebarStore.getIdForEntity(entity);
    const classes = classNames({
        "sidebar-entity": true,
        "highlighted": entityId === sidebarStore.highlightedEntityId,
    });

    return (
        <EntityLink
            type={entity.type}
            name={entity.name}
            className={classes}
            draggable={true}
            data-id={entityId}
            onMouseEnter={async () => {
                await tooltipStore.showTooltip(iconRef, entity.type, entity.name);
            }}
            onMouseLeave={() => {
                tooltipStore.hideTooltip();
            }}
        >
            <Icon type={entity.type} name={entity.name} ref={iconRef} />
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
