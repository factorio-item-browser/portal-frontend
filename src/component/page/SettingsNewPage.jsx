import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SettingsNewStore from "../../store/SettingsNewStore";
import { ROUTE_SETTINGS, STATUS_WARNING } from "../../helper/const";

import ButtonLink from "../link/ButtonLink";
import ButtonList from "./setting/ButtonList";
import TextBox from "../common/TextBox";
import ActionButton from "../common/ActionButton";
import Status from "../status/Status";
import SaveGameStep from "./settingNew/step/SaveGameStep";
import DataAvailabilityStep from "./settingNew/step/DataAvailabilityStep";
import AdditionalOptionsStep from "./settingNew/step/AdditionalOptionsStep";

/**
 * The component representing the page for creating a new setting.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsNewPage = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(SettingsNewStore);

    useEffect(() => {
        document.title = t("settings-new.title");
    }, []);

    return (
        <Fragment>
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

            <Status status={STATUS_WARNING}>
                {t("settings-new.upload-file.important-note.description-1")}
                <ol>
                    <li>{t("settings-new.upload-file.important-note.step-1")}</li>
                    <li>{t("settings-new.upload-file.important-note.step-2")}</li>
                    <li>{t("settings-new.upload-file.important-note.step-3")}</li>
                    <li>{t("settings-new.upload-file.important-note.step-4")}</li>
                </ol>
                {t("settings-new.upload-file.important-note.description-2")}
            </Status>

            {settingsNewStore.showSaveGameStep ? <SaveGameStep /> : null}
            {settingsNewStore.showDataAvailabilityStep ? <DataAvailabilityStep /> : null}
            {settingsNewStore.showAdditionalOptionsStep ? <AdditionalOptionsStep /> : null}

            <ButtonList>
                <ButtonLink
                    route={ROUTE_SETTINGS}
                    className={!settingsNewStore.showAdditionalOptionsStep ? "spacing-fix" : null}
                >
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
