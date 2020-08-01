import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../common/Icon";

import "./Mod.scss";

/**
 * Builds the external link to the mod.
 * @param {ModData} mod
 * @return {string}
 */
function buildExternalModLink(mod) {
    if (mod.name === "base") {
        return "https://www.factorio.com/";
    }
    return `https://mods.factorio.com/mod/${mod.name}`;
}

/**
 * The component representing a mod pn the settings page.
 * @param {ModData} mod
 * @return {ReactDOM}
 * @constructor
 */
const Mod = ({ mod }) => {
    const { t } = useTranslation();

    return (
        <a
            className="entity mod-entity"
            href={buildExternalModLink(mod)}
            target="_blank"
            rel="noopener noreferrer nofollow"
        >
            <div className="mod-icon">
                <Icon type="mod" name={mod.name} transparent={true} />
            </div>

            <div className="mod-content">
                <h3 className="entity-head">{mod.label}</h3>
                <div className="mod-details">
                    <div className="mod-detail">
                        <span className="label">{t("settings.mod-list.name")}</span>
                        <span className="value">{mod.name}</span>
                    </div>
                    <div className="mod-detail">
                        <span className="label">{t("settings.mod-list.author")}</span>
                        <span className="value">{mod.author}</span>
                    </div>
                    <div className="mod-detail">
                        <span className="label">{t("settings.mod-list.version")}</span>
                        <span className="value">{mod.version}</span>
                    </div>
                </div>
            </div>

            <FontAwesomeIcon className="external-link-icon" icon={faExternalLinkAlt} />
        </a>
    );
};

Mod.propTypes = {
    mod: PropTypes.object.isRequired,
};

export default observer(Mod);
