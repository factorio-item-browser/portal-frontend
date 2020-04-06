import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SettingsNewStore from "../../store/SettingsNewStore";

import ModListUpload from "./newSetting/ModListUpload";
import ModListUploadStatus from "../status/ModListUploadStatus";
import OptionsList from "./setting/option/OptionsList";
import OptionSettingName from "./setting/option/OptionSettingName";
import OptionRecipeMode from "./setting/option/OptionRecipeMode";
import OptionLocale from "./setting/option/OptionLocale";
import Section from "../common/Section";
import SettingStatus from "../status/SettingStatus";

/**
 * The component representing the page for creating a new setting.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsNewPage = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(SettingsNewStore);

    useEffect(() => {
        document.title = t("settings-create.title");
        settingsNewStore.changeOptions({ name: t("settings-create.new-setting-name") });
    }, []);

    return (
        <Fragment>
            <Section headline={t("settings-create.upload-file.headline")}>
                <ModListUpload />
                <ModListUploadStatus
                    modNames={settingsNewStore.uploadedModNames}
                    error={settingsNewStore.uploadError}
                />
            </Section>

            {settingsNewStore.showAvailabilityStep ? (
                <Section headline={"2. Data availability"}>
                    <SettingStatus settingStatus={settingsNewStore.settingStatus} />
                </Section>
            ) : null}

            {settingsNewStore.showOptionsStep ? (
                <Section headline={"3. Additional options"}>
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
            ) : null}
        </Fragment>
    );
};

export default observer(SettingsNewPage);
