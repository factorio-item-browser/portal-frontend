// @flow

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useDocumentTitle(title?: string, options?: { [key: string]: any }): void {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = title ? t(title, options) : t("index.title");
    }, [title, ...Object.values(options || {})]);
}
