// @flow

import { useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { iconManager } from "../class/IconManager";
import { tooltipStoreContext } from "../store/TooltipStore";
import type { ElementRef } from "../type/common";

export function useDocumentTitle(title?: string, options?: { [key: string]: any }): void {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = title ? t(title, options) : t("index.title");
    }, [title, ...Object.values(options || {})]);
}

export function useIcon(type: string, name: string): void {
    useEffect((): void => {
        iconManager.requestIcon(type, name);
    }, [type, name]);
}

type UseTooltipResult = {
    showTooltip: () => Promise<void>,
    hideTooltip: () => void,
};

export function useTooltip(type: string, name: string, ref: ElementRef): UseTooltipResult {
    const tooltipStore = useContext(tooltipStoreContext);

    return {
        showTooltip: useCallback(async (): Promise<void> => {
            await tooltipStore.showTooltip(ref, type, name);
        }, [type, name, ref]),
        hideTooltip: useCallback((): void => {
            tooltipStore.hideTooltip();
        }),
    };
}
