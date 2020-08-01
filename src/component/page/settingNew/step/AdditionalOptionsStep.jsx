import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { settingsNewStoreContext } from "../../../../store/SettingsNewStore";
import { settingsStoreContext } from "../../../../store/SettingsStore";
import Section from "../../../common/Section";
import OptionLocale from "../../setting/option/OptionLocale";
import OptionRecipeMode from "../../setting/option/OptionRecipeMode";
import OptionSettingName from "../../setting/option/OptionSettingName";
import OptionsList from "../../setting/option/OptionsList";

const AdditionalOptionsStep = () => {
    const { t } = useTranslation();
    const settingsStore = useContext(settingsStoreContext);
    const settingsNewStore = useContext(settingsNewStoreContext);

    useEffect(() => {
        settingsNewStore.changeOptions({
            locale: settingsStore.selectedOptions.locale,
            recipeMode: settingsStore.selectedOptions.recipeMode,
        });
    }, []);

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
