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
import TextBox from "../common/TextBox";

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
        settingsNewStore.changeOptions({ name: t("settings-new.new-setting-name") });
    }, []);

    return (
        <Fragment>
            <Section headline={t("settings-new.upload-file.headline")}>
                <TextBox>
                    <p>
                        Please select your mod-list.json file from the mods directory of your game installation. This
                        file contains a list of mods you are currently using. The Factorio Item Browser needs this
                        combination of mods to provide you the correct data.
                    </p>

                    <p>In a default installation you find the mod-list.json file at the following location:</p>
                    <dl>
                        <dt>Windows:</dt>
                        <dd>%APPDATA%\Factorio\mods\</dd>
                        <dt>Mac OS X:</dt>
                        <dd>~/Library/Application Support/factorio/mods/</dd>
                        <dt>Linux distributions:</dt>
                        <dd>~/.factorio/mods/</dd>
                    </dl>

                    <p>
                        Note: No file is uploaded to the server. The selected file gets processed directly in your
                        browser, and only the list of mod names is send to the server.
                    </p>
                </TextBox>

                <ModListUpload />
                <ModListUploadStatus
                    modNames={settingsNewStore.uploadedModNames}
                    error={settingsNewStore.uploadError}
                />
            </Section>

            {settingsNewStore.showAvailabilityStep ? (
                <Section headline={"2. Data availability"}>
                    <TextBox>
                        <p>
                            The export of data to a combination of mods is fully automated. The server will download the
                            required mods from the mod portal, launch the game to dump all the required data, and add it
                            to the database.
                        </p>

                        <p>The automatic data export has some limitations:</p>
                        <ul>
                            <li>
                                The export always uses the latest version of the game and the mods. Older versions are
                                not supported.
                            </li>
                            <li>
                                The export uses the default settings of the mods. No changes to these settings can be
                                made.
                            </li>
                            <li>All mods except the base mod must be available on the Factorio Mod Portal.</li>
                        </ul>
                        <p>
                            If these limitations are not met the displayed data may not be accurate. When in doubt
                            please check the data in-game.
                        </p>
                        <p>
                            Please be aware that as long as the data is not available the Factorio Item Browser will
                            display the unmodded Vanilla data. Depending on the load on the server the data export will
                            take some time. So continue playing for now and check back later.
                        </p>
                    </TextBox>

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
                        Save new setting
                    </Button>
                ) : null}
            </ButtonList>
        </Fragment>
    );
};

export default observer(SettingsNewPage);
