import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import {
    SETTING_STATUS_ERRORED,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
    STATUS_ERROR,
    STATUS_WARNING,
} from "../../helper/const";
import RouteStore from "../../store/RouteStore";

import Status from "./Status";

/**
 * The component globally displaying the setting status.
 * @return {ReactDOM|null}
 * @constructor
 */
const GlobalSettingStatus = () => {
    const { t } = useTranslation();
    const routeStore = useContext(RouteStore);

    const setting = routeStore.setting;
    if (!setting) {
        return null;
    }

    if (setting.status === SETTING_STATUS_PENDING || setting.status === SETTING_STATUS_UNKNOWN) {
        return (
            <Status status={STATUS_WARNING}>
                <h3>{t("setting-status.pending.headline")}</h3>
                {t("setting-status.pending.global-description")}
            </Status>
        );
    }

    if (setting.status === SETTING_STATUS_ERRORED) {
        return (
            <Status status={STATUS_ERROR}>
                <h3>{t("setting-status.errored.headline")}</h3>
                {t("setting-status.errored.global-description")}
            </Status>
        );
    }

    return null;
};

export default observer(GlobalSettingStatus);
