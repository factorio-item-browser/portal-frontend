import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { ROUTE_SETTINGS } from "../../../helper/const";
import RouteStore from "../../../store/RouteStore";

import Link from "../../link/Link";

import "./SettingsButton.scss";

/**
 * The component representing a link to the settings page.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsButton = () => {
    const routeStore = useContext(RouteStore);
    const { t } = useTranslation();

    return (
        <Link className="settings-button" route={ROUTE_SETTINGS}>
            <div className="link-icon">
                <FontAwesomeIcon icon={faCogs} />
            </div>
            <div className="label">{t("sidebar.setting", { name: routeStore.settingName })}</div>
        </Link>
    );
};

export default observer(SettingsButton);
