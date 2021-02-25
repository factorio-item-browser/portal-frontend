import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import InputOption from "./InputOption";

type Props = {
    value: string,
    onChange: (value: string) => void,
};

/**
 * The component representing the setting name as option.
 */
const OptionSettingName: FC<Props> = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <InputOption
            label={t("settings.name.label")}
            placeholder={t("settings.name.placeholder")}
            value={value}
            onChange={onChange}
            fullWidth
            error={value === ""}
        />
    );
};

export default observer(OptionSettingName);
