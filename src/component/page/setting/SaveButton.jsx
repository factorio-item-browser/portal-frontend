import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";

import SettingsStore from "../../../store/SettingsStore";

import Button from "../../common/Button";

import "./SaveButton.scss";

/**
 * The component representing the (sticky) button to save changes on the settings.
 * @return {ReactDOM|null}
 * @constructor
 */
const SaveButton = () => {
    const settingStore = useContext(SettingsStore);

    if (!settingStore.isSaveButtonVisible) {
        return null;
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
            Save Changes
        </Button>
    );
};

export default observer(SaveButton);
