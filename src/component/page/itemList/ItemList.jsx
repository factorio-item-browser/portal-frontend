// @flow

import { observer } from "mobx-react-lite";
import React from "react";
import type { ItemMetaData } from "../../../type/transfer";
import ItemListIcon from "../../icon/ItemListIcon";

import "./ItemList.scss";

type Props = {
    items: ItemMetaData[],
};

/**
 * The component representing the list of items as icons.
 * @constructor
 */
const ItemList = ({ items }: Props): React$Node => {
    return (
        <div className="item-list">
            {items.map((item: ItemMetaData): React$Node => {
                return <ItemListIcon key={`${item.type}|${item.name}`} type={item.type} name={item.name} />;
            })}
        </div>
    );
};

export default (observer(ItemList): typeof ItemList);
