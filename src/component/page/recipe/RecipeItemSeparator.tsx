import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";

import "./RecipeItemSeparator.scss";

/**
 * The component representing the item separator in the recipe details.
 */
const RecipeItemSeparator: FC = () => {
    return (
        <div className="recipe-item-separator">
            <FontAwesomeIcon icon={faChevronRight} />
        </div>
    );
};

export default observer(RecipeItemSeparator);
