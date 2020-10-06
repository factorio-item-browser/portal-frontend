// @flow

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React from "react";
import type { ItemMetaData } from "../../../type/transfer";
import ItemListIcon from "../../icon/ItemListIcon";

import "./ItemList.scss";

type Props = {
    items: ItemMetaData[],
    loading?: boolean,
};

/**
 * The component representing the list of items as icons.
 * @constructor
 */
const ItemList = ({ items, loading }: Props): React$Node => {
    return (
        <div className="item-list">
            {items.map((item: ItemMetaData): React$Node => {
                return <ItemListIcon key={`${item.type}|${item.name}`} type={item.type} name={item.name} />;
            })}

            {loading && (
                <div className="loading">
                    <FontAwesomeIcon icon={faSpinner} spin />
                </div>
            )}
        </div>
    );
};

export default (observer(ItemList): typeof ItemList);
