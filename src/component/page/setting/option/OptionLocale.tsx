import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import locales from "../../../../locale/meta.json";
import SelectOption, { Item } from "./SelectOption";

const localeItems: Item[] = Object.entries(locales).map(([value, label]) => ({ value, label }));
localeItems.sort((left, right) => left.label.localeCompare(right.label));

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
