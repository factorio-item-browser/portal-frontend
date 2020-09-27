// @flow

import { observer } from "mobx-react-lite";
import React, { createRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PaginatedList from "../../class/PaginatedList";
import type { ResultsData } from "../../type/transfer";
import { useScrollEffect } from "../../util/hooks";
import ActionButton from "./ActionButton";

type Props<TEntity, TData: { ...ResultsData<TEntity>, ... }> = {
    paginatedList: PaginatedList<TEntity, TData>,
    localePrefix: string,
    loadOnScroll?: boolean,
};

/**
 * The button loading more pages for a paginated list.
 * @constructor
 */
const PaginatedListButton = <TEntity, TData: { ...ResultsData<TEntity>, ... }>({
    paginatedList,
    localePrefix,
    loadOnScroll,
}: Props<TEntity, TData>): React$Node => {
    const { t } = useTranslation();
    const ref = createRef();

    if (loadOnScroll) {
        useScrollEffect(async (): Promise<void> => {
            if (
                ref.current &&
                paginatedList.hasNextPage &&
                !paginatedList.isLoading &&
                window.scrollY + window.innerHeight > ref.current.offsetTop - window.innerHeight * 0.1
            ) {
                await paginatedList.requestNextPage();
            }
        });
    }

    const handleClick = useCallback(async (): Promise<void> => {
        await paginatedList.requestNextPage();
    }, [paginatedList]);

    return (
        <ActionButton
            primary
            spacing
            ref={ref}
            label={t(`${localePrefix}.load`)}
            loadingLabel={t(`${localePrefix}.loading`)}
            isVisible={paginatedList.hasNextPage}
            isLoading={paginatedList.isLoading}
            onClick={handleClick}
        />
    );
};

export default (observer(PaginatedListButton): typeof PaginatedListButton);
