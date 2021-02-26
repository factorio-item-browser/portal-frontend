import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { RecipeItemData } from "../../../type/transfer";
import RecipeItem from "./RecipeItem";
import RecipeItemTime from "./RecipeItemTime";

import "./RecipeItemList.scss";

type Props = {
    headline: string;
    items: RecipeItemData[];
    craftingTime?: number;
};

/**
 * The component representing a list of items on the recipe details page.
 */
const RecipeItemList: FC<Props> = ({ headline, items, craftingTime = 0 }) => {
    return (
        <div className="recipe-item-list">
            <h3>{headline}</h3>
            {craftingTime > 0 ? <RecipeItemTime craftingTime={craftingTime} /> : null}
            {items.map((item, index) => {
                return <RecipeItem key={`${item.type}-${item.name}-${index}`} item={item} />;
            })}
        </div>
    );
};

export default observer(RecipeItemList);
