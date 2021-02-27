import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { CRAFTING_TIME_INFINITE } from "../../../const/config";
import { formatCraftingTime } from "../../../util/format";

import "./RecipeItem.scss";

type Props = {
    craftingTime: number;
};

/**
 * The component representing the crafting time as a recipe item.
 */
const RecipeItemTime: FC<Props> = ({ craftingTime }) => {
    const { t } = useTranslation();

    let amount;
    if (craftingTime >= CRAFTING_TIME_INFINITE) {
        amount = <div className="amount infinite">∞</div>;
    } else {
        amount = <div className="amount">{formatCraftingTime(craftingTime)}</div>;
    }

    return (
        <div className="recipe-item">
            {amount}
            <div className="icon icon-clock" />
            <div className="label">{t("recipe-details.time")}</div>
        </div>
    );
};

export default observer(RecipeItemTime);
