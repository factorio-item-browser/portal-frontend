// @flow

import i18next from "i18next";
import type { SettingDetailsData, SettingMetaData } from "../type/transfer";

export function getTranslatedSettingName(setting: SettingMetaData | SettingDetailsData): string {
    if (setting.isTemporary && setting.name === "Temporary") {
        return i18next.t("setting-name.temporary");
    }

    return setting.name;
}
