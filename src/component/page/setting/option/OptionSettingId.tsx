import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { SettingData } from "../../../../api/transfer";
import { getTranslatedSettingName } from "../../../../util/setting";
import SelectOption, { Item } from "./SelectOption";

function createSettingItems(settings: Map<string, SettingData>): Item[] {
    const items: Item[] = [];
    for (const setting of settings.values()) {
        items.push({
            value: setting.combinationId,
            label: getTranslatedSettingName(setting),
        });
    }
    items.sort((left: Item, right: Item): number => left.label.localeCompare(right.label));
    return items;
}

type Props = {
    settings: Map<string, SettingData>;
    value: string;
    onChange: (value: string) => void | Promise<void>;
    loading?: boolean;
};

/**
 * The component representing the settings as option.
 */
const OptionSettingId: FC<Props> = ({ settings, value, onChange, loading }) => {
    const { t } = useTranslation();

    return (
        <SelectOption
            items={createSettingItems(settings)}
            label={t("settings.current-setting.label")}
            value={value}
            onChange={onChange}
            loading={loading}
            fullWidth
        />
    );
};

export default observer(OptionSettingId);
