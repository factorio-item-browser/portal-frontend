import { RecipeMode, SettingStatus, ValidationProblemType } from "../util/const";

export type ItemType = "item" | "fluid" | string;
export type NamesByTypes = { [key: string]: string[] };
export type SidebarEntityType = "item" | "fluid" | "recipe" | string;

export type ResultsData<T> = {
    results: T[];
    numberOfResults: number;
};

export type EntityData = {
    type: string;
    name: string;
    label: string;
    recipes: RecipeData[];
    numberOfRecipes: number;
};

export type IconsStyleRequestData = {
    cssSelector: string;
    entities: NamesByTypes;
};

export type IconsStyleData = {
    processedEntities: NamesByTypes;
    style: string;
};

export type InitData = {
    setting: SettingData;
    lastUsedSetting?: SettingData;
    sidebarEntities: SidebarEntityData[];
    scriptVersion: string;
};

export type ItemMetaData = {
    type: string;
    name: string;
};

export type ItemListData = ResultsData<ItemMetaData>;

export type ItemRecipesData = ResultsData<EntityData> & {
    type: ItemType;
    name: string;
    label: string;
    description: string;
};

export type MachineData = {
    name: string;
    label: string;
    craftingSpeed: number;
    numberOfItems: number;
    numberOfFluids: number;
    numberOfModules: number;
    energyUsage: number;
    energyUsageUnit: string;
};

export type ModData = {
    name: string;
    label: string;
    author: string;
    version: string;
};

export type RecipeData = {
    craftingTime: number;
    ingredients: RecipeItemData[];
    products: RecipeItemData[];
    isExpensive: boolean;
};

export type RecipeDetailsData = {
    name: string;
    label: string;
    description: string;
    recipe?: RecipeData;
    expensiveRecipe?: RecipeData;
};

export type RecipeItemData = {
    type: ItemType;
    name: string;
    label: string;
    amount: number;
};

export type RecipeMachinesData = ResultsData<MachineData>;

export type SearchResultsData = ResultsData<EntityData> & {
    query: string;
};

export type SettingData = {
    combinationId: string;
    combinationHash: string;
    name: string;
    locale: string;
    recipeMode: RecipeMode;
    status: SettingStatus;
    isTemporary: boolean;
};

export type SettingOptionsData = {
    name: string;
    locale: string;
    recipeMode: string;
};

export type SettingValidationData = {
    combinationId: string;
    status: SettingStatus;
    isValid: boolean;
    validationProblems: ValidationProblemData[];
    existingSetting?: SettingData;
};

export type SidebarEntityData = {
    type: SidebarEntityType;
    name: string;
    label: string;
    pinnedPosition: number;
    lastViewTime: string;
};

export type ValidationProblemData = {
    mod: string;
    version: string;
    type: ValidationProblemType;
    dependency: string;
};
