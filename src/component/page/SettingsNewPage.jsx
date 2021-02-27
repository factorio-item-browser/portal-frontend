// @flow

import { faArrowRight, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import React, { Fragment, useCallback, useContext, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ROUTE_SETTINGS } from "../../const/route";
import { settingsNewStoreContext } from "../../store/SettingsNewStore";
import { settingsStoreContext } from "../../store/SettingsStore";
import { useDocumentTitle } from "../../util/hooks";
import ActionButton from "../button/ActionButton";
import ButtonGroup from "../button/ButtonGroup";
import LinkedButton from "../button/LinkedButton";
import Section from "../common/Section";
import TextBox from "../common/TextBox";
import AdditionalOptionsStep from "./settingNew/step/AdditionalOptionsStep";
import DataAvailabilityStep from "./settingNew/step/DataAvailabilityStep";
import SaveGameStep from "./settingNew/step/SaveGameStep";

/**
 * The component representing the page for creating a new setting.
 * @constructor
 */
const SettingsNewPage = (): React$Node => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(settingsNewStoreContext);
    const settingsStore = useContext(settingsStoreContext);

    useDocumentTitle("settings-new.title");
    useEffect((): void => {
        settingsNewStore.changeOptions({
            locale: settingsStore.selectedOptions.locale,
            recipeMode: settingsStore.selectedOptions.recipeMode,
        });
    }, []);
    const handleSaveClick = useCallback(async (): Promise<void> => {
        if (settingsNewStore.hasExistingSetting) {
            await settingsNewStore.changeToSetting();
        } else {
            await settingsNewStore.saveNewSetting();
        }
    }, []);

    let label;
    let loadingLabel;
    if (settingsNewStore.hasExistingSetting) {
        const settingName = settingsNewStore.settingStatus?.existingSetting?.name;
        label = t("settings-new.change-to-setting", { name: settingName });
        loadingLabel = t("settings-new.changing-to-setting", { name: settingName });
    } else {
        label = t("settings-new.save-new-setting");
        loadingLabel = t("settings-new.saving-new-setting");
    }

    return (
        <Fragment>
            <Section headline={t("settings-new.add-new-setting")}>
                <TextBox>
                    <p>{t("settings-new.explanation.description-1")}</p>

                    <p>{t("settings-new.explanation.description-2")}</p>
                    <dl>
                        <dt>Windows:</dt>
                        <dd>%APPDATA%\Factorio\saves\</dd>
                        <dt>Mac OS X:</dt>
                        <dd>~/Library/Application Support/factorio/saves/</dd>
                        <dt>Linux:</dt>
                        <dd>~/.factorio/saves/</dd>
                    </dl>

                    <p>
                        <Trans i18nKey="settings-new.explanation.description-3">
                            Lorem ipsum dolor sit amet
                            <a href="https://mods.factorio.com/" target="_blank" rel="noopener noreferrer nofollow">
                                Factorio mod portal
                            </a>
                            .
                        </Trans>
                    </p>
                </TextBox>
            </Section>

            {settingsNewStore.showSaveGameStep ? <SaveGameStep /> : null}
            {settingsNewStore.showDataAvailabilityStep ? <DataAvailabilityStep /> : null}
            {settingsNewStore.showAdditionalOptionsStep ? <AdditionalOptionsStep /> : null}

            <ButtonGroup spacing>
                <LinkedButton label={t("settings-new.cancel")} icon={faTimes} route={ROUTE_SETTINGS} />
                <ActionButton
                    primary
                    label={label}
                    loadingLabel={loadingLabel}
                    icon={settingsNewStore.hasExistingSetting ? faArrowRight : faSave}
                    isVisible={settingsNewStore.showSaveButton}
                    isLoading={settingsNewStore.isSavingNewSetting}
                    onClick={handleSaveClick}
                />
            </ButtonGroup>
        </Fragment>
    );
};

export default (observer(SettingsNewPage): typeof SettingsNewPage);
