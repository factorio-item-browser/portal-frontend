import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SettingsNewStore from "../../store/SettingsNewStore";
import { ROUTE_SETTINGS } from "../../helper/const";

import ButtonLink from "../link/ButtonLink";
import ButtonList from "./setting/ButtonList";
import ModListUpload from "./settingNew/ModListUpload";
import ModListUploadStatus from "../status/ModListUploadStatus";
import OptionLocale from "./setting/option/OptionLocale";
import OptionRecipeMode from "./setting/option/OptionRecipeMode";
import OptionSettingName from "./setting/option/OptionSettingName";
import OptionsList from "./setting/option/OptionsList";
import Section from "../common/Section";
import SettingStatus from "../status/SettingStatus";
import TextBox from "../common/TextBox";
import SettingsStore from "../../store/SettingsStore";
import ActionButton from "../common/ActionButton";

/**
 * The component representing the page for creating a new setting.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsNewPage = () => {
    const { t } = useTranslation();
    const settingsStore = useContext(SettingsStore);
    const settingsNewStore = useContext(SettingsNewStore);

    useEffect(() => {
        document.title = t("settings-new.title");
        settingsNewStore.changeOptions({
            ...settingsStore.selectedOptions,
            name: t("settings-new.new-setting-name"),
        });
    }, []);

    return (
        <Fragment>
            <Section headline={t("settings-new.upload-file.headline")}>
                <TextBox>
                    <p>{t("settings-new.upload-file.description-1")}</p>

                    <p>{t("settings-new.upload-file.description-2")}</p>
                    <dl>
                        <dt>Windows:</dt>
                        <dd>%APPDATA%\Factorio\mods\</dd>
                        <dt>Mac OS X:</dt>
                        <dd>~/Library/Application Support/factorio/mods/</dd>
                        <dt>Linux:</dt>
                        <dd>~/.factorio/mods/</dd>
                    </dl>

                    <p>{t("settings-new.upload-file.description-3")}</p>
                </TextBox>

                <ModListUpload />
                <ModListUploadStatus
                    modNames={settingsNewStore.uploadedModNames}
                    error={settingsNewStore.uploadError}
                />
            </Section>

            {settingsNewStore.showAvailabilityStep ? (
                <Section headline={t("settings-new.data-availability.headline")}>
                    <TextBox>
                        <p>{t("settings-new.data-availability.description-1")}</p>
                        <p>{t("settings-new.data-availability.description-2")}</p>
                        <ul>
                            <li>{t("settings-new.data-availability.description-limit-1")}</li>
                            <li>{t("settings-new.data-availability.description-limit-2")}</li>
                            <li>{t("settings-new.data-availability.description-limit-3")}</li>
                        </ul>
                        <p>{t("settings-new.data-availability.description-3")}</p>
                        <p>{t("settings-new.data-availability.description-4")}</p>
                    </TextBox>

                    <SettingStatus settingStatus={settingsNewStore.settingStatus} />
                </Section>
            ) : null}

            {settingsNewStore.showOptionsStep ? (
                <Section headline={t("settings-new.additional-options.headline")}>
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

            <ButtonList>
                <ButtonLink route={ROUTE_SETTINGS}>
                    <FontAwesomeIcon icon={faTimes} />
                    {t("settings-new.cancel")}
                </ButtonLink>

                <ActionButton
                    primary
                    label={t("settings-new.save-new-setting")}
                    loadingLabel={t("settings-new.saving-new-setting")}
                    icon={faSave}
                    isVisible={settingsNewStore.showSaveButton}
                    isLoading={settingsNewStore.isSavingNewSetting}
                    onClick={async () => {
                        await settingsNewStore.saveNewSetting();
                    }}
                />
            </ButtonList>
        </Fragment>
    );
};

export default observer(SettingsNewPage);
