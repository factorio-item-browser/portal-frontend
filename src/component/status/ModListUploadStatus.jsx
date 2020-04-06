import React, { useContext } from "react";

import Status from "./Status";
import { observer } from "mobx-react-lite";
import SettingsCreateStore from "../../store/SettingsCreateStore";
import { STATUS_ERROR, STATUS_SUCCESS } from "../../helper/const";

/**
 * The component representing the status of the mod-list upload.
 * @return {ReactDOM|null}
 * @constructor
 */
const ModListUploadStatus = () => {
    const settingsCreateStore = useContext(SettingsCreateStore);

    if (settingsCreateStore.uploadError) {
        return (
            <Status status={STATUS_ERROR}>
                <h3>Unable to extract mods:</h3>
                An error occurred.
            </Status>
        );
    }

    if (settingsCreateStore.uploadedModNames.length > 0) {
        return (
            <Status status={STATUS_SUCCESS}>
                <h3>{settingsCreateStore.uploadedModNames.length} mods have been detected:</h3>
                {settingsCreateStore.uploadedModNames.join(", ")}
            </Status>
        );
    }

    return null;
};

export default observer(ModListUploadStatus);
