import {observer} from "mobx-react-lite";
import React, {Fragment, useContext} from "react";

import RecipeStore from "../../store/RecipeStore";
import DetailsHead from "../common/DetailsHead";
import Detail from "../common/Detail";
import CopyTemplate from "../common/CopyTemplate";
import {useTranslation} from "react-i18next";

/**
 * The component representing the details page of a recipe.
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeDetailsPage = () => {
    const { t } = useTranslation();
    const recipeStore = useContext(RecipeStore);
    const data = recipeStore.currentRecipeDetails;

    return (
        <Fragment>
            <DetailsHead
                type="recipe"
                name={data.name}
                title={data.label}
            >
                <Detail hidden={!data.description}>{data.description}</Detail>
                <Detail>
                    <CopyTemplate
                        label={t("copy-template.rich-text-icon.label")}
                        template={`[img=recipe/${data.name}]`}
                        description={t("copy-template.rich-text-icon.description")}
                    />
                </Detail>
            </DetailsHead>
        </Fragment>
    );
};

export default observer(RecipeDetailsPage);
