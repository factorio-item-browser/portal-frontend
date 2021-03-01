import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { settingsNewStoreContext } from "../../../../store/SettingsNewStore";
import { BoxStatus } from "../../../../util/const";
import Section from "../../../common/Section";
import Status from "../../../status/Status";
import SaveGameFileInput from "../SaveGameFileInput";

/**
 * The step for selecting the save game to read the mod list from.
 */
const SaveGameStep: FC = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(settingsNewStoreContext);

    const error = settingsNewStore.saveGameError;
    const isProcessing = settingsNewStore.isSaveGameProcessing;
    const modNames = settingsNewStore.saveGameModNames;

    let status;
    if (error !== null) {
        status = (
            <Status status={BoxStatus.Error}>
                <h3>{t(`settings-new.savegame-error.${error.name}.headline`)}</h3>
                {t(`settings-new.savegame-error.${error.name}.description`)}
            </Status>
        );
    } else if (isProcessing) {
        status = (
            <Status status={BoxStatus.Pending}>
                <h3>{t(`settings-new.processing-savegame`)}</h3>
            </Status>
        );
    } else if (modNames.length > 0) {
        status = (
            <Status status={BoxStatus.Success}>
                <h3>{t("settings-new.savegame-modlist.headline", { count: modNames.length })}</h3>
                {modNames.join(", ")}
            </Status>
        );
    } else {
        status = (
            <Status status={BoxStatus.Info}>
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
