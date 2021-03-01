import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { INTERVAL_CHECK_SETTING_STATUS } from "../../const/config";
import { globalStoreContext } from "../../store/GlobalStore";
import { BoxStatus, SettingStatus } from "../../util/const";
import { useInterval } from "../../util/hooks";
import Status from "./Status";

/**
 * The component globally displaying the setting status.
 */
const GlobalSettingStatus: FC = () => {
    const { t } = useTranslation();
    const globalStore = useContext(globalStoreContext);
    const setting = globalStore.setting;

    useInterval(
        INTERVAL_CHECK_SETTING_STATUS * 1000,
        async (): Promise<void> => {
            await globalStore.checkSettingStatus();
        },
    );

    if (!setting) {
        return null;
    }

    if (setting.status === SettingStatus.Pending || setting.status === SettingStatus.Unknown) {
        return (
            <Status status={BoxStatus.Warning}>
                <h3>{t("setting-status.pending.headline")}</h3>
                {t("setting-status.pending.description-global")}
            </Status>
        );
    }

    if (setting.status === SettingStatus.Errored) {
        return (
            <Status status={BoxStatus.Error}>
                <h3>{t("setting-status.errored.headline")}</h3>
                {t("setting-status.errored.description-global")}
            </Status>
        );
    }

    return null;
};

export default observer(GlobalSettingStatus);
