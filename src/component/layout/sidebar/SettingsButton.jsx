import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { ROUTE_SETTINGS } from "../../../const/route";
import { routeStoreContext } from "../../../store/RouteStore";

import ButtonLink from "../../link/ButtonLink";

import "./SettingsButton.scss";

/**
 * The component representing a link to the settings page.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsButton = () => {
    const routeStore = useContext(routeStoreContext);
    const { t } = useTranslation();

    return (
        <ButtonLink className="settings-button" primary route={ROUTE_SETTINGS}>
            <div className="link-icon">
                <FontAwesomeIcon icon={faCogs} />
            </div>
            <div className="label">{t("sidebar.setting", { name: routeStore.setting.name })}</div>
        </ButtonLink>
    );
};

export default observer(SettingsButton);
