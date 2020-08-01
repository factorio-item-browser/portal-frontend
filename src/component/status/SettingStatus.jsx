import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    SETTING_STATUS_AVAILABLE,
    SETTING_STATUS_ERRORED,
    SETTING_STATUS_LOADING,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
    STATUS_ERROR,
    STATUS_PENDING,
    STATUS_SUCCESS,
    STATUS_WARNING,
} from "../../helper/const";
import Status from "./Status";

/**
 * The map of the setting status to the actual box status.
 * @type {Object<string, string>}
 */
const STATUS_MAP = {
    [SETTING_STATUS_AVAILABLE]: STATUS_SUCCESS,
    [SETTING_STATUS_ERRORED]: STATUS_ERROR,
    [SETTING_STATUS_LOADING]: STATUS_PENDING,
    [SETTING_STATUS_PENDING]: STATUS_WARNING,
    [SETTING_STATUS_UNKNOWN]: STATUS_WARNING,
};

/**
 * The component representing the status of a setting.
 * @param {?SettingStatusData} settingStatus
 * @return {ReactDOM|null}
 * @constructor
 */
const SettingStatus = ({ settingStatus }) => {
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

SettingStatus.propTypes = {
    settingStatus: PropTypes.object,
};

export default observer(SettingStatus);
