import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { settingsNewStoreContext } from "../../../../store/SettingsNewStore";
import { BoxStatus, SettingStatus } from "../../../../util/const";
import Section from "../../../common/Section";
import Status from "../../../status/Status";

const settingStatusToBoxStatusMap: { [key: string]: BoxStatus } = {
    [SettingStatus.Available]: BoxStatus.Success,
    [SettingStatus.Errored]: BoxStatus.Error,
    [SettingStatus.Loading]: BoxStatus.Pending,
    [SettingStatus.Pending]: BoxStatus.Warning,
    [SettingStatus.Unknown]: BoxStatus.Warning,
};

/**
 * The component representing the step for checking the data availability.
 */
const DataAvailabilityStep: FC = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(settingsNewStoreContext);

    const status = settingsNewStore.validatedSetting?.status;
    if (!status) {
        return null;
    }

    return (
        <Section headline={t("settings-new.step.data-availability")}>
            <Status status={settingStatusToBoxStatusMap[status]}>
                <h3>{t(`setting-status.${status}.headline`)}</h3>
                {t(`setting-status.${status}.description`)}
            </Status>
        </Section>
    );
};

export default observer(DataAvailabilityStep);
