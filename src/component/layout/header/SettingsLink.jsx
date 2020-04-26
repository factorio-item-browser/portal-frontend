import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { ROUTE_SETTINGS } from "../../../helper/const";
import RouteStore from "../../../store/RouteStore";
import Link from "../../link/Link";

import "./SettingsLink.scss";

/**
 * The component representing the link to the settings in the big header.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsLink = () => {
    const routeStore = useContext(RouteStore);
    const { t } = useTranslation();

    return (
        <Link className="settings-link" route={ROUTE_SETTINGS}>
            <div className="link-icon">
                <FontAwesomeIcon icon={faCogs} />
            </div>
            <div className="label">{t("sidebar.setting", { name: routeStore.setting.name })}</div>
        </Link>
    );
};

export default observer(SettingsLink);
