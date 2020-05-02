import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { formatCraftingTime } from "../../helper/format";

import "./CompactRecipeSeparator.scss";
import { CRAFTING_TIME_INFINITE } from "../../helper/const";

/**
 * Renders the element for the crafting time.
 * @param {number} craftingTime
 * @returns {ReactNode}
 */
function renderCraftingTime(craftingTime) {
    if (craftingTime <= 0) {
        return null;
    }

    if (craftingTime >= CRAFTING_TIME_INFINITE) {
        return <span className="time infinite">∞</span>
    }

    const formattedTime = formatCraftingTime(craftingTime);
    return <span className="time">{formattedTime}</span>;
}

/**
 * The component representing the separator of a compact recipe.
 * @param {number} craftingTime
 * @returns {ReactDOM}
 * @constructor
 */
const CompactRecipeSeparator = ({ craftingTime = 0 }) => {
    return (
        <div className="compact-recipe-separator">
            <FontAwesomeIcon icon={faChevronRight} />
            {renderCraftingTime(craftingTime)}
        </div>
    );
};

CompactRecipeSeparator.propTypes = {
    craftingTime: PropTypes.number,
};

export default observer(CompactRecipeSeparator);
