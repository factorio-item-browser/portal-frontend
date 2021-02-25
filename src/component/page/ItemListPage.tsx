import { observer } from "mobx-react-lite";
import React, { FC, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { itemListStoreContext } from "../../store/ItemListStore";
import { useDocumentTitle } from "../../util/hooks";
import Section from "../common/Section";
import ItemList from "./itemList/ItemList";

type Props = {
}

/**
 * The component representing the page with the full item list.
 */
const ItemListPage: FC<Props> = () => {
    const itemListStore = useContext(itemListStoreContext);
    const { t } = useTranslation();
    useDocumentTitle(t("item-list.title"));

    const itemList = itemListStore.paginatedItemList;
    useEffect((): void => {
        if (!itemList.isLoading && itemList.hasNextPage) {
            (async (): Promise<void> => {
                await itemList.requestNextPage();
            })();
        }
    }, [itemList.isLoading, itemList.hasNextPage]);

    return (
        <Section headline={t("item-list.headline", { count: itemList.numberOfResults })}>
            <ItemList items={itemList.results} loading={itemList.hasNextPage} />
        </Section>
    );
};

export default observer(ItemListPage);
