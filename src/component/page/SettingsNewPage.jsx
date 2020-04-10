import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
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

            <ButtonList>
                <ButtonLink route={ROUTE_SETTINGS}>
                    <FontAwesomeIcon icon={faTimes} />
                    Cancel
                </ButtonLink>
                {settingsNewStore.showSaveButton ? (
                    <Button
                        primary
                        onClick={async () => {
                            await settingsNewStore.saveNewSetting();
                        }}
                    >
                        <FontAwesomeIcon icon={faSave} />
                        Save New Setting
                    </Button>
                ) : null}
            </ButtonList>
        </Fragment>
    );
};

export default observer(SettingsNewPage);
