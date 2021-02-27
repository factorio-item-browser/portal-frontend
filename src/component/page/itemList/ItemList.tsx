import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { ItemMetaData } from "../../../type/transfer";
import ItemListIcon from "../../icon/ItemListIcon";

import "./ItemList.scss";

type Props = {
    items: ItemMetaData[];
    loading?: boolean;
};

/**
 * The component representing the list of items as icons.
 */
const ItemList: FC<Props> = ({ items, loading }) => {
    return (
        <div className="item-list">
            {items.map((item) => {
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

export default observer(ItemList);
