import { observer } from "mobx-react-lite";
import React, {Fragment, useContext, useEffect} from "react";
import { useTranslation } from "react-i18next";

import RecipeStore from "../../store/RecipeStore";
import DetailsHead from "../common/DetailsHead";
import Detail from "../common/Detail";
import CopyTemplate from "../common/CopyTemplate";
import Section from "../common/Section";
import EntityList from "../entity/EntityList";
import MachineEntity from "../entity/MachineEntity";
import RecipeDetails from "./recipe/RecipeDetails";

/**
 * The component representing the details page of a recipe.
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeDetailsPage = () => {
    const recipeStore = useContext(RecipeStore);
    const { t } = useTranslation();
    const data = recipeStore.currentRecipeDetails;

    useEffect(() => {
        document.title = t("recipe-details.title", { label: data.label });
    }, [data.label]);

    return (
        <Fragment>
            <DetailsHead type="recipe" name={data.name} title={t("recipe-details.headline", { label: data.label })}>
                <Detail hidden={!data.description}>{data.description}</Detail>
                <Detail>
                    <CopyTemplate
                        label={t("copy-template.rich-text-icon.label")}
                        template={`[img=recipe/${data.name}]`}
                        description={t("copy-template.rich-text-icon.description")}
                    />
                </Detail>
            </DetailsHead>

            <RecipeDetails recipe={data.recipe} />
            {data.expensiveRecipe ? <RecipeDetails recipe={data.expensiveRecipe} /> : null}

            <Section headline={t("recipe-details.machine.headline", { count: data.machines.length })}>
                <EntityList>
                    {data.machines.map((machine) => {
                        return <MachineEntity key={machine.name} machine={machine} />;
                    })}
                </EntityList>
            </Section>
        </Fragment>
    );
};

export default observer(RecipeDetailsPage);
