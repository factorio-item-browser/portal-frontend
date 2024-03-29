import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { SettingData } from "../../api/transfer";
import { BoxStatus, SettingStatus } from "../../util/const";
import Status from "./Status";

import "./SelectedSettingStatus.scss";

type Props = {
    setting: SettingData;
};

/**
 * The component representing the setting status within the mod list of said setting.
 */
const SelectedSettingStatus: FC<Props> = ({ setting }) => {
    const { t } = useTranslation();

    if (setting.status === SettingStatus.Pending || setting.status === SettingStatus.Unknown) {
        return (
            <Status status={BoxStatus.Warning} className="selected-setting-status">
                <h3>{t("setting-status.pending.headline")}</h3>
                {t("setting-status.pending.description-setting")}
            </Status>
        );
    }

    if (setting.status === SettingStatus.Errored) {
        return (
            <Status status={BoxStatus.Error} className="mod-list-setting-status">
                <h3>{t("setting-status.errored.headline")}</h3>
                {t("setting-status.errored.description-setting")}
            </Status>
        );
    }

    return null;
};

export default observer(SelectedSettingStatus);
