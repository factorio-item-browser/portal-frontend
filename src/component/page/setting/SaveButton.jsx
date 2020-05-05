import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";

import SettingsStore from "../../../store/SettingsStore";

import Button from "../../common/Button";

import "./SaveButton.scss";
import { useTranslation } from "react-i18next";

/**
 * The component representing the (sticky) button to save changes on the settings.
 * @return {ReactDOM|null}
 * @constructor
 */
const SaveButton = () => {
    const { t } = useTranslation();
    const settingStore = useContext(SettingsStore);

    if (!settingStore.isSaveButtonVisible) {
        return null;
    }

    if (settingStore.isSavingChanges) {
        return (
            <Button className="save-button" primary spacing>
                <FontAwesomeIcon icon={faSpinner} spin />
                {t("settings.saving-changes")}
            </Button>
        );
    }

    return (
        <Button
            className="save-button"
            primary
            spacing
            onClick={async () => {
                await settingStore.saveOptions();
            }}
        >
            <FontAwesomeIcon icon={faSave} />
            {t("settings.save-changes")}
        </Button>
    );
};

export default observer(SaveButton);
