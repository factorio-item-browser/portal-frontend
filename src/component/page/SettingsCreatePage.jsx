import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SettingsCreateStore from "../../store/SettingsCreateStore";

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
const SettingsCreatePage = () => {
    const { t } = useTranslation();
    const settingsCreateStore = useContext(SettingsCreateStore);

    useEffect(() => {
        document.title = t("settings-create.title");
        settingsCreateStore.changeOptions({ name: t("settings-create.new-setting-name") });
    }, []);

    return (
        <Fragment>
            <Section headline={t("settings-create.upload-file.headline")}>
                <ModListUpload />
                <ModListUploadStatus />
            </Section>

            {settingsCreateStore.showAvailabilityStep ? (
                <Section headline={"2. Data availability"}>
                    <SettingStatus />
                </Section>
            ) : null}

            {settingsCreateStore.showOptionsStep ? (
                <Section headline={"3. Additional options"}>
                    <OptionsList>
                        <OptionSettingName
                            value={settingsCreateStore.newOptions.name}
                            onChange={(name) => settingsCreateStore.changeOptions({ name })}
                        />

                        <OptionRecipeMode
                            value={settingsCreateStore.newOptions.recipeMode}
                            onChange={(recipeMode) => settingsCreateStore.changeOptions({ recipeMode })}
                        />

                        <OptionLocale
                            value={settingsCreateStore.newOptions.locale}
                            onChange={(locale) => settingsCreateStore.changeOptions({ locale })}
                        />
                    </OptionsList>
                </Section>
            ) : null}
        </Fragment>
    );
};

export default observer(SettingsCreatePage);
