import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import SettingsCreateStore from "../../store/SettingsCreateStore";
import {
    SETTING_STATUS_AVAILABLE, SETTING_STATUS_ERRORED,
    SETTING_STATUS_LOADING,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN, STATUS_ERROR,
    STATUS_PENDING, STATUS_SUCCESS,
    STATUS_WARNING
} from "../../helper/const";

import Status from "./Status";

const STATUS_MAP = {
    [SETTING_STATUS_AVAILABLE]: STATUS_SUCCESS,
    [SETTING_STATUS_ERRORED]: STATUS_ERROR,
    [SETTING_STATUS_LOADING]: STATUS_PENDING,
    [SETTING_STATUS_PENDING]: STATUS_WARNING,
    [SETTING_STATUS_UNKNOWN]: STATUS_PENDING,
};

/**
 * The component representing the status of a setting.
 * @return {ReactDOM|null}
 * @constructor
 */
const SettingStatus = () => {
    const settingsCreateStore = useContext(SettingsCreateStore);
    const { t } = useTranslation();

    if (!settingsCreateStore.settingStatus) {
        return null;
    }

    const status = settingsCreateStore.settingStatus.status;

    return (
        <Status status={STATUS_MAP[status]}>
            <h3>{t(`setting-status.${status}.headline`)}</h3>
            {t(`setting-status.${status}.description`)}
        </Status>
    );
};

export default observer(SettingStatus);
