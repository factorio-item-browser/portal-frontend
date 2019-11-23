import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
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
    const { t } = useTranslation();
    const recipeStore = useContext(RecipeStore);
    const data = recipeStore.currentRecipeDetails;

    const exampleItems = [
        {
            type: "item",
            name: "iron-plate",
            amount: 9,
        },
        {
            type: "item",
            name: "iron-gear-wheel",
            amount: 5,
        },
        {
            type: "item",
            name: "electronic-circuit",
            amount: 3,
        },
        {
            type: "item",
            name: "assembling-machine-1",
            amount: 1,
        },
    ];
    const exampleItems2 = [
        {
            type: "item",
            name: "assembling-machine-2",
            amount: 1,
        },
    ];

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

            <RecipeDetails ingredients={exampleItems} products={exampleItems2} />

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
