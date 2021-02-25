import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import type { SettingMetaData } from "../../../../type/transfer";
import { getTranslatedSettingName } from "../../../../util/setting";
import SelectOption from "./SelectOption";
import type { Item } from "./SelectOption";

function createSettingItems(settings: SettingMetaData[]): Item[] {
    const items = settings.map((setting: SettingMetaData): Item => ({
        value: setting.combinationId,
        label: getTranslatedSettingName(setting),
    }));
    items.sort((left: Item, right: Item): number => left.label.localeCompare(right.label));
    return items;
}

type Props = {
    settings: SettingMetaData[],
    value: string,
    onChange: (value: string) => void | Promise<void>,
    loading?: boolean,
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
