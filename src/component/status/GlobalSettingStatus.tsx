import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { INTERVAL_CHECK_SETTING_STATUS } from "../../const/config";
import { SETTING_STATUS_ERRORED, SETTING_STATUS_PENDING, SETTING_STATUS_UNKNOWN } from "../../const/settingStatus";
import { STATUS_ERROR, STATUS_WARNING } from "../../const/status";
import { routeStoreContext } from "../../store/RouteStore";
import { useInterval } from "../../util/hooks";
import Status from "./Status";

type Props = {
}

/**
 * The component globally displaying the setting status.
 */
const GlobalSettingStatus: FC<Props> = () => {
    const { t } = useTranslation();
    const routeStore = useContext(routeStoreContext);
    const setting = routeStore.setting;

    useInterval(INTERVAL_CHECK_SETTING_STATUS * 1000, async (): Promise<void> => {
        await routeStore.checkSettingStatus();
    });

    if (!setting) {
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
