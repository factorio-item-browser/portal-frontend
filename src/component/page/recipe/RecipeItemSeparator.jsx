import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React from "react";

import "./RecipeItemSeparator.scss";

/**
 * The component representing the item separator in the recipe details.
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeItemSeparator = () => {
    return (
        <div className="recipe-item-separator">
            <FontAwesomeIcon icon={faChevronRight} />
        </div>
    );
};

export default observer(RecipeItemSeparator);
