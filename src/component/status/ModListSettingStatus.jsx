import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { SETTING_STATUS_ERRORED, SETTING_STATUS_PENDING, SETTING_STATUS_UNKNOWN } from "../../const/settingStatus";
import { STATUS_ERROR, STATUS_WARNING } from "../../const/status";
import Status from "./Status";

import "./ModListSettingStatus.scss";

/**
 * The component representing the setting status within the mod list of said setting.
 * @param {SettingMetaData} setting
 * @return {ReactDOM|null}
 * @constructor
 */
const ModListSettingStatus = ({ setting }) => {
    const { t } = useTranslation();

    if (setting.status === SETTING_STATUS_PENDING || setting.status === SETTING_STATUS_UNKNOWN) {
        return (
            <Status status={STATUS_WARNING} className="mod-list-setting-status">
                <h3>{t("setting-status.pending.headline")}</h3>
                {t("setting-status.pending.description-setting")}
            </Status>
        );
    }

    if (setting.status === SETTING_STATUS_ERRORED) {
        return (
            <Status status={STATUS_ERROR} className="mod-list-setting-status">
                <h3>{t("setting-status.errored.headline")}</h3>
                {t("setting-status.errored.description-setting")}
            </Status>
        );
    }

    return null;
};

ModListSettingStatus.propTypes = {
    setting: PropTypes.object.isRequired,
};

export default observer(ModListSettingStatus);
