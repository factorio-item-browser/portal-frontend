import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { STATUS_INFO } from "../../../../const/status";
import { settingsNewStoreContext } from "../../../../store/SettingsNewStore";
import Section from "../../../common/Section";
import Status from "../../../status/Status";
import OptionLocale from "../../setting/option/OptionLocale";
import OptionRecipeMode from "../../setting/option/OptionRecipeMode";
import OptionSettingName from "../../setting/option/OptionSettingName";
import OptionsList from "../../setting/option/OptionsList";

type Props = {
}

/**
 * The component representing the step for setting additional options.
 */
const AdditionalOptionsStep: FC<Props> = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(settingsNewStoreContext);

    return (
        <Section headline={t("settings-new.step.additional-options")}>
            {settingsNewStore.hasExistingSetting ? (
                <Status status={STATUS_INFO}>
                    <h3>{t("settings-new.existing-setting.headline")}</h3>
                    {t("settings-new.existing-setting.description")}
                </Status>
            ) : null}

            <OptionsList>
                <OptionSettingName
                    value={settingsNewStore.newOptions.name}
                    onChange={(name) => settingsNewStore.changeOptions({ name })}
                />

                <OptionRecipeMode
                    value={settingsNewStore.newOptions.recipeMode}
                    onChange={(recipeMode) => settingsNewStore.changeOptions({ recipeMode })}
                />

                <OptionLocale
                    value={settingsNewStore.newOptions.locale}
                    onChange={(locale) => settingsNewStore.changeOptions({ locale })}
                />
            </OptionsList>
        </Section>
    );
};

export default observer(AdditionalOptionsStep);
