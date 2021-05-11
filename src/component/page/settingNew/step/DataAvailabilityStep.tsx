import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { settingsNewStoreContext } from "../../../../store/SettingsNewStore";
import { BoxStatus, SettingStatus } from "../../../../util/const";
import Section from "../../../common/Section";
import Status from "../../../status/Status";
import OptionCombinationId from "../../setting/option/OptionCombinationId";
import OptionsList from "../../setting/option/OptionsList";

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

    const validatedSetting = settingsNewStore.validatedSetting;
    if (!validatedSetting) {
        return null;
    }

    let statusElement;
    if (validatedSetting.status !== SettingStatus.Loading && !validatedSetting.isValid) {
        statusElement = (
            <Status status={BoxStatus.Error}>
                <h3>{t("setting-status.invalid.headline")}</h3>
                {t("setting-status.invalid.description-1")}
                <ol>
                    {validatedSetting.validationProblems.map((problem, index) => {
                        const label = t(`setting-status.validation-problem.${problem.type}`, {
                            mod: problem.mod,
                            dependency: problem.dependency,
                        });
                        return <li key={index}>{label}</li>;
                    })}
                </ol>
                {t("setting-status.invalid.description-2")}
            </Status>
        );
    } else {
        statusElement = (
            <Status status={settingStatusToBoxStatusMap[validatedSetting.status]}>
                <h3>{t(`setting-status.${validatedSetting.status}.headline`)}</h3>
                {t(`setting-status.${validatedSetting.status}.description`)}
            </Status>
        );
    }

    let combinationIdElement;
    if (validatedSetting.combinationId) {
        combinationIdElement = (
            <OptionsList>
                <OptionCombinationId value={validatedSetting.combinationId} />
            </OptionsList>
        );
    }

    return (
        <Section headline={t("settings-new.step.data-availability")}>
            {statusElement}
            {combinationIdElement}
        </Section>
    );
};

export default observer(DataAvailabilityStep);
