import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ROUTE_SETTINGS } from "../../const/route";
import { useDocumentTitle } from "../../helper/hooks";
import { settingsNewStoreContext } from "../../store/SettingsNewStore";
import ActionButton from "../common/ActionButton";
import Section from "../common/Section";
import TextBox from "../common/TextBox";
import ButtonLink from "../link/ButtonLink";
import ButtonList from "./setting/ButtonList";
import AdditionalOptionsStep from "./settingNew/step/AdditionalOptionsStep";
import DataAvailabilityStep from "./settingNew/step/DataAvailabilityStep";
import SaveGameStep from "./settingNew/step/SaveGameStep";

/**
 * The component representing the page for creating a new setting.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsNewPage = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(settingsNewStoreContext);

    useDocumentTitle("settings-new.title");

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
