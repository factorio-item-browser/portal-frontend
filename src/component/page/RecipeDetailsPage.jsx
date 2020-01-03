import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import RecipeStore from "../../store/RecipeStore";
import DetailsHead from "../common/DetailsHead";
import Detail from "../common/Detail";
import CopyTemplate from "../common/CopyTemplate";
import RecipeDetails from "./recipe/RecipeDetails";
import RecipeMachinesList from "./recipe/RecipeMachinesList";

/**
 * The component representing the details page of a recipe.
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeDetailsPage = () => {
    const recipeStore = useContext(RecipeStore);
    const { t } = useTranslation();
    const details = recipeStore.currentRecipeDetails;

    useEffect(() => {
        document.title = t("recipe-details.title", { label: details.label });
    }, [details.label]);

    return (
        <Fragment>
            <DetailsHead
                type="recipe"
                name={details.name}
                title={t("recipe-details.headline", { label: details.label })}
            >
                <Detail hidden={!details.description}>{details.description}</Detail>
                <Detail>
                    <CopyTemplate
                        label={t("copy-template.rich-text-icon.label")}
                        template={`[img=recipe/${details.name}]`}
                        description={t("copy-template.rich-text-icon.description")}
                    />
                </Detail>
            </DetailsHead>

            <RecipeDetails recipe={details.recipe} />
            <RecipeDetails recipe={details.expensiveRecipe} />

            <RecipeMachinesList paginatedList={recipeStore.paginatedMachinesList} />
        </Fragment>
    );
};

export default observer(RecipeDetailsPage);
