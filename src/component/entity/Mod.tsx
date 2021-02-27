import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { ModData } from "../../type/transfer";
import Icon from "../icon/Icon";
import ExternalLink from "../link/ExternalLink";

import "./Mod.scss";

type Props = {
    mod: ModData;
};

function buildExternalModLink(mod: ModData): string {
    if (mod.name === "base") {
        return "https://www.factorio.com/";
    }
    return `https://mods.factorio.com/mod/${mod.name}`;
}

/**
 * The component representing a mod pn the settings page.
 */
const Mod: FC<Props> = ({ mod }) => {
    const { t } = useTranslation();

    return (
        <ExternalLink className="entity mod-entity" url={buildExternalModLink(mod)}>
            <div className="mod-icon">
                <Icon type="mod" name={mod.name} />
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
        </ExternalLink>
    );
};

export default observer(Mod);
