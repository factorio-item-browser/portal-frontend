import { observer } from "mobx-react-lite";
import Section from "../../../common/Section";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import SettingsNewStore from "../../../../store/SettingsNewStore";
import OptionSettingName from "../../setting/option/OptionSettingName";
import OptionRecipeMode from "../../setting/option/OptionRecipeMode";
import OptionLocale from "../../setting/option/OptionLocale";
import OptionsList from "../../setting/option/OptionsList";

const AdditionalOptionsStep = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(SettingsNewStore);

    return (
        <Section headline={t("settings-new.step.additional-options")}>
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
