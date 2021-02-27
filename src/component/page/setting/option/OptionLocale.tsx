import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { LOCALES } from "../../../../const/locale";
import SelectOption, { Item } from "./SelectOption";

function createSortedLocaleItems(locales: { [key: string]: string }): Item[] {
    const items = Object.keys(locales).map(
        (locale: string): Item => ({
            value: locale,
            label: locales[locale],
        }),
    );
    items.sort((left: Item, right: Item): number => left.label.localeCompare(right.label));
    return items;
}
const localeItems = createSortedLocaleItems(LOCALES);

type Props = {
    value: string;
    onChange: (value: string) => void;
};

/**
 * The component representing the locale as option.
 */
const OptionLocale: FC<Props> = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <SelectOption
            label={t("settings.locale.label")}
            description={t("settings.locale.description")}
            items={localeItems}
            value={value}
            onChange={onChange}
        />
    );
};

export default observer(OptionLocale);
