import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ERROR_PAGE_NOT_FOUND } from "../../const/error";
import { useDocumentTitle } from "../../helper/hooks";
import { recipeStoreContext } from "../../store/RecipeStore";
import CopyTemplate from "../common/CopyTemplate";
import Detail from "../common/Detail";
import DetailsHead from "../common/DetailsHead";
import ErrorBox from "../error/ErrorBox";
import RecipeDetails from "./recipe/RecipeDetails";
import RecipeMachinesList from "./recipe/RecipeMachinesList";

/**
 * The component representing the details page of a recipe.
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeDetailsPage = () => {
    const recipeStore = useContext(recipeStoreContext);
    const { t } = useTranslation();
    const details = recipeStore.currentRecipeDetails;

    useDocumentTitle(details.label ? "recipe-details.title" : null, { label: details.label });

    if (recipeStore.hasNotFoundError) {
        return <ErrorBox type={ERROR_PAGE_NOT_FOUND} />;
    }

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
                        template={`[recipe=${details.name}]`}
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
