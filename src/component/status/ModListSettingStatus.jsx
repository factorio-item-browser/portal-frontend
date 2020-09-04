// @flow

import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import { SETTING_STATUS_ERRORED, SETTING_STATUS_PENDING, SETTING_STATUS_UNKNOWN } from "../../const/settingStatus";
import { STATUS_ERROR, STATUS_WARNING } from "../../const/status";
import type { SettingMetaData } from "../../type/transfer";
import Status from "./Status";

import "./ModListSettingStatus.scss";

type Props = {
    setting: SettingMetaData,
};

/**
 * The component representing the setting status within the mod list of said setting.
 * @constructor
 */
const ModListSettingStatus = ({ setting }: Props): React$Node => {
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

export default (observer(ModListSettingStatus): typeof ModListSettingStatus);
