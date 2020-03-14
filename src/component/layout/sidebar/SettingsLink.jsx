import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { ROUTE_SETTINGS } from "../../../helper/const";
import SettingsStore from "../../../store/SettingsStore";

import Link from "../../link/Link";

import "./SettingsLink.scss";

/**
 * The component representing a link to the settings page.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsLink = () => {
    const settingsStore = useContext(SettingsStore);
    const { t } = useTranslation();

    return (
        <Link className="settings-link" route={ROUTE_SETTINGS}>
            <div className="link-icon">
                <FontAwesomeIcon icon={faCogs} />
            </div>
            <div className="label">{t("sidebar.setting", { name: settingsStore.settingMeta.name })}</div>
        </Link>
    );
};

export default observer(SettingsLink);
