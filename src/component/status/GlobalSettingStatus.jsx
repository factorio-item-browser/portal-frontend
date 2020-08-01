import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
    INTERVAL_CHECK_SETTING_STATUS,
    SETTING_STATUS_ERRORED,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
    STATUS_ERROR,
    STATUS_WARNING,
} from "../../helper/const";
import { routeStoreContext } from "../../store/RouteStore";

import Status from "./Status";

/**
 * The component globally displaying the setting status.
 * @return {ReactDOM|null}
 * @constructor
 */
const GlobalSettingStatus = () => {
    const { t } = useTranslation();
    const routeStore = useContext(routeStoreContext);
    const setting = routeStore.setting;

    useEffect(() => {
        const interval = window.setInterval(async () => {
            await routeStore.checkSettingStatus();
        }, INTERVAL_CHECK_SETTING_STATUS * 1000);
        return () => window.clearInterval(interval);
    }, []);

    if (!setting || !routeStore.showGlobalSettingStatus) {
        return null;
    }

    if (setting.status === SETTING_STATUS_PENDING || setting.status === SETTING_STATUS_UNKNOWN) {
        return (
            <Status status={STATUS_WARNING}>
                <h3>{t("setting-status.pending.headline")}</h3>
                {t("setting-status.pending.description-global")}
            </Status>
        );
    }

    if (setting.status === SETTING_STATUS_ERRORED) {
        return (
            <Status status={STATUS_ERROR}>
                <h3>{t("setting-status.errored.headline")}</h3>
                {t("setting-status.errored.description-global")}
            </Status>
        );
    }

    return null;
};

export default observer(GlobalSettingStatus);
