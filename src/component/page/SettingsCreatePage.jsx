import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Section from "../common/Section";

import ModListUpload from "./newSetting/ModListUpload";

/**
 * The component representing the page for creating a new setting.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsCreatePage = () => {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("settings-create.title");
    }, []);

    return (
        <Section headline={t("settings-create.upload-file.headline")}>
            <ModListUpload />
        </Section>
    );
};

export default observer(SettingsCreatePage);
