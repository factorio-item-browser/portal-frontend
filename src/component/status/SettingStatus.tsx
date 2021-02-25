import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import {
    SETTING_STATUS_AVAILABLE,
    SETTING_STATUS_ERRORED,
    SETTING_STATUS_LOADING,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
} from "../../const/settingStatus";
import { STATUS_ERROR, STATUS_PENDING, STATUS_SUCCESS, STATUS_WARNING } from "../../const/status";
import type { SettingStatusData } from "../../type/transfer";
import Status from "./Status";

const STATUS_MAP: { [key: string]: string } = {
    [SETTING_STATUS_AVAILABLE]: STATUS_SUCCESS,
    [SETTING_STATUS_ERRORED]: STATUS_ERROR,
    [SETTING_STATUS_LOADING]: STATUS_PENDING,
    [SETTING_STATUS_PENDING]: STATUS_WARNING,
    [SETTING_STATUS_UNKNOWN]: STATUS_WARNING,
};

type Props = {
    settingStatus?: SettingStatusData,
};

/**
 * The component representing the status of a setting.
 */
const SettingStatus: FC<Props> = ({ settingStatus }) => {
    const { t } = useTranslation();

    if (!settingStatus) {
        return null;
    }

    return (
        <Status status={STATUS_MAP[settingStatus.status]}>
            <h3>{t(`setting-status.${settingStatus.status}.headline`)}</h3>
            {t(`setting-status.${settingStatus.status}.description`)}
        </Status>
    );
};

export default observer(SettingStatus);
