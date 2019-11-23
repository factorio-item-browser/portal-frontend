import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import { formatCraftingTime } from "../../../helper/format";

import "./RecipeItem.scss";

/**
 * The component representing the crafting time as a recipe item.
 * @param craftingTime
 * @returns {*}
 * @constructor
 */
const RecipeItemTime = ({ craftingTime }) => {
    const { t } = useTranslation();

    return (
        <div className="recipe-item">
            <div className="amount">{formatCraftingTime(craftingTime)}</div>
            <div className="icon icon-clock" />
            <div className="label">{t("recipe-details.time")}</div>
        </div>
    );
};

RecipeItemTime.propTypes = {
    craftingTime: PropTypes.number.isRequired,
};

export default observer(RecipeItemTime);
