import { faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SettingsNewStore from "../../store/SettingsNewStore";
import { ROUTE_SETTINGS } from "../../helper/const";

import Button from "../common/Button";
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

    let saveButton = null;
    if (settingsNewStore.showSaveButton) {
        if (settingsNewStore.isSavingNewSetting) {
            saveButton = (
                <Button primary>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    {t("settings-new.saving-new-setting")}
                </Button>
            );
        } else {
            saveButton = (
                <Button
                    primary
                    onClick={async () => {
                        await settingsNewStore.saveNewSetting();
                    }}
                >
                    <FontAwesomeIcon icon={faSave} />
                    {t("settings-new.save-new-setting")}
                </Button>
            );
        }
    }

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
                {saveButton}
            </ButtonList>
        </Fragment>
    );
};

export default observer(SettingsNewPage);
