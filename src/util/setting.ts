import i18next from "i18next";
import { SettingMetaData } from "../api/transfer";

export function getTranslatedSettingName(setting: SettingMetaData): string {
    if (setting.isTemporary && setting.name === "Temporary") {
        return i18next.t("setting-name.temporary");
    }
    return setting.name;
}
