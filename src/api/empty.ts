import { RecipeMode, SettingStatus } from "../util/const";
import {
    ItemListData,
    ItemRecipesData,
    RecipeDetailsData,
    RecipeMachinesData,
    SearchResultsData,
    SettingData,
} from "./transfer";

export const emptyItemListData: ItemListData = {
    results: [],
    numberOfResults: 0,
};

export const emptyItemRecipesData: ItemRecipesData = {
    type: "item",
    name: "",
    label: "",
    description: "",
    results: [],
    numberOfResults: 0,
};

export const emptyRecipeDetailsData: RecipeDetailsData = {
    name: "",
    label: "",
    description: "",
};

export const emptyRecipeMachinesData: RecipeMachinesData = {
    results: [],
    numberOfResults: 0,
};

export const emptySearchResultsData: SearchResultsData = {
    query: "",
    results: [],
    numberOfResults: 0,
};

export const emptySettingData: SettingData = {
    combinationId: "",
    name: "Vanilla",
    locale: "en",
    recipeMode: RecipeMode.Hybrid,
    status: SettingStatus.Available,
    isTemporary: false,
};
