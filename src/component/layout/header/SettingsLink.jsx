// @flow

import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ROUTE_SETTINGS } from "../../../const/route";
import { routeStoreContext } from "../../../store/RouteStore";
import { getTranslatedSettingName } from "../../../util/setting";
import Link from "../../link/Link";

import "./SettingsLink.scss";

/**
 * The component representing the link to the settings in the big header.
 * @constructor
 */
const SettingsLink = (): React$Node => {
    const routeStore = useContext(routeStoreContext);
    const { t } = useTranslation();

    return (
        <Link className="settings-link" route={ROUTE_SETTINGS}>
            <div className="link-icon">
                <FontAwesomeIcon icon={faCogs} />
            </div>
            <div className="label">{t("sidebar.setting", { name: getTranslatedSettingName(routeStore.setting) })}</div>
        </Link>
    );
};

export default (observer(SettingsLink): typeof SettingsLink);
