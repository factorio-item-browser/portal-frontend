// @flow

import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import type { SettingMetaData } from "../../../../type/transfer";
import SelectOption from "./SelectOption";
import type { Item } from "./SelectOption";

function createSettingItems(settings: SettingMetaData[]): Item[] {
    const items = settings.map((setting: SettingMetaData): Item => ({
        value: setting.combinationId,
        label: setting.name, // @todo Translate "Vanilla" and "Temporary"
    }));
    items.sort((left: Item, right: Item): number => left.label.localeCompare(right.label));
    return items;
}

type Props = {
    settings: SettingMetaData[],
    value: string,
    onChange: (string) => void | Promise<void>,
    loading?: boolean,
};

/**
 * The component representing the settings as option.
 * @constructor
 */
const OptionSettingId = ({ settings, value, onChange, loading }: Props): React$Node => {
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

export default (observer(OptionSettingId): typeof OptionSettingId);
