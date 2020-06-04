import { observer } from "mobx-react-lite";
import Section from "../../../common/Section";
import { useTranslation } from "react-i18next";
import React, { useContext } from "react";
import SettingsNewStore from "../../../../store/SettingsNewStore";
import SaveGameFileInput from "../SaveGameFileInput";
import { STATUS_ERROR, STATUS_INFO, STATUS_PENDING, STATUS_SUCCESS } from "../../../../helper/const";
import Status from "../../../status/Status";

/**
 * The step for selecting the save game to read the mod lsit from.
 * @return {ReactDOM}
 * @constructor
 */
const SaveGameStep = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(SettingsNewStore);

    const error = settingsNewStore.saveGameError;
    const isProcessing = settingsNewStore.isSaveGameProcessing;
    const modNames = settingsNewStore.saveGameModNames;

    let status = null;
    if (error !== "") {
        status = (
            <Status status={STATUS_ERROR}>
                <h3>{t(`settings-new.savegame-error.${error}.headline`)}</h3>
                {t(`settings-new.savegame-error.${error}.description`)}
            </Status>
        );
    } else if (isProcessing) {
        status = (
            <Status status={STATUS_PENDING}>
                <h3>{t(`settings-new.processing-savegame`)}</h3>
            </Status>
        );
    } else if (modNames.length > 0) {
        status = (
            <Status status={STATUS_SUCCESS}>
                <h3>{t("settings-new.savegame-modlist.headline", { count: modNames.length })}</h3>
                {modNames.join(", ")}
            </Status>
        );
    } else {
        status = (
            <Status status={STATUS_INFO}>
                <h3>{t(`settings-new.savegame-upload-note.headline`)}</h3>
                {t(`settings-new.savegame-upload-note.description`)}
            </Status>
        );
    }

    return (
        <Section headline={t("settings-new.step.savegame")}>
            <SaveGameFileInput />
            {status}
        </Section>
    );
};

export default observer(SaveGameStep);