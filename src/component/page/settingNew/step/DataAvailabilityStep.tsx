import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
    SETTING_STATUS_AVAILABLE,
    SETTING_STATUS_ERRORED,
    SETTING_STATUS_LOADING,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
} from "../../../../const/settingStatus";
import { STATUS_ERROR, STATUS_PENDING, STATUS_SUCCESS, STATUS_WARNING } from "../../../../const/status";
import { settingsNewStoreContext } from "../../../../store/SettingsNewStore";
import Section from "../../../common/Section";
import Status from "../../../status/Status";

/**
 * The map of the setting status to the actual box status.
 */
const STATUS_MAP: { [key: string]: string } = {
    [SETTING_STATUS_AVAILABLE]: STATUS_SUCCESS,
    [SETTING_STATUS_ERRORED]: STATUS_ERROR,
    [SETTING_STATUS_LOADING]: STATUS_PENDING,
    [SETTING_STATUS_PENDING]: STATUS_WARNING,
    [SETTING_STATUS_UNKNOWN]: STATUS_WARNING,
};

/**
 * The component representing the step for checking the data availability.
 */
const DataAvailabilityStep: FC = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(settingsNewStoreContext);

    const status = settingsNewStore.settingStatus?.status;
    if (!status) {
        return null;
    }

    return (
        <Section headline={t("settings-new.step.data-availability")}>
            <Status status={STATUS_MAP[status]}>
                <h3>{t(`setting-status.${status}.headline`)}</h3>
                {t(`setting-status.${status}.description`)}
            </Status>
        </Section>
    );
};

export default observer(DataAvailabilityStep);
