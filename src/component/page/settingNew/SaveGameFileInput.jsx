// @flow

import { faFileArchive } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { settingsNewStoreContext } from "../../../store/SettingsNewStore";

import "./SaveGameFileInput.scss";

/**
 * The component representing the big fat button to select a savegame file..
 * @return {ReactDOM}
 * @constructor
 */
const SaveGameFileInput = (): React$Node => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(settingsNewStoreContext);
    const inputId = "savegame-file-input";

    const handleChange = useCallback(async (event: SyntheticInputEvent<HTMLInputElement>): Promise<void> => {
        await settingsNewStore.processSaveGame(event.currentTarget.files[0])
    }, []);

    return (
        <div className="savegame-file-input">
            <label htmlFor={inputId}>
                <FontAwesomeIcon icon={faFileArchive} />
                {t("settings-new.select-savegame-file")}
            </label>

            <input
                id={inputId}
                type="file"
                accept="application/zip,application/octet-stream,.zip"
                hidden={true}
                onChange={handleChange}
            />
        </div>
    );
};

export default (observer(SaveGameFileInput): typeof SaveGameFileInput);
