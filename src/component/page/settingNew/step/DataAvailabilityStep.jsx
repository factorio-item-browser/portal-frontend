import { observer } from "mobx-react-lite";
import Section from "../../../common/Section";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import SettingsNewStore from "../../../../store/SettingsNewStore";
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
} from "../../../../helper/const";
import Status from "../../../status/Status";

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
 * The component representing the step for checking the data availability.
 * @return {ReactDOM|null}
 * @constructor
 */
const DataAvailabilityStep = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(SettingsNewStore);

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