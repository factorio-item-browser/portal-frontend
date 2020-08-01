// @flow

export type ItemType = "item" | "fluid";
export type NamesByTypes = { [string]: string[] };
export type SidebarEntityType = "item" | "fluid" | "recipe";

export type ResultsData<T> = {
    results: T[],
    numberOfResults: number,
};

export type EntityData = {
    type: string,
    name: string,
    label: string,
    recipes: RecipeData[],
    numberOfRecipes: number,
};

export type IconsStyleData = {
    processedEntities: NamesByTypes,
    style: string,
};

export type InitData = {
    setting: SettingMetaData,
    settingHash: string,
    locale: string,
    sidebarEntities: SidebarEntityData[],
    scriptVersion: string,
};

export type ItemRecipesData = {
    ...ResultsData<EntityData>,
    type: ItemType,
    name: string,
    label: string,
    description: string,
};

export type MachineData = {
    name: string,
    label: string,
    craftingSpeed: number,
    numberOfItems: number,
    numberOfFluids: number,
    numberOfModules: number,
    energyUsage: number,
    energyUsageUnit: string,
};

export type ModData = {
    name: string,
    label: string,
    author: string,
    version: string,
};

export type RecipeData = {
    craftingTime: number,
    ingredients: RecipeItemData[],
    products: RecipeItemData[],
    isExpensive: boolean,
};

export type RecipeDetailsData = {
    name: string,
    label: string,
    description: string,
    recipe?: RecipeData,
    expensiveRecipe?: RecipeData,
};

export type RecipeItemData = {
    type: ItemType,
    name: string,
    label: string,
    amount: number,
};

export type RecipeMachinesData = {
    ...ResultsData<MachineData>,
};

export type SearchResultsData = {
    ...ResultsData<EntityData>,
    query: string,
};

export type SettingCreateData = {
    ...SettingOptionsData,
    modNames: string[],
};

export type SettingDetailsData = {
    ...SettingDetailsData,
    ...SettingOptionsData,
    mods: ModData[],
    modIconsStyle: IconsStyleData,
};

export type SettingMetaData = {
    combinationId: string,
    name: string,
    status: string,
};

export type SettingOptionsData = {
    name: string,
    locale: string,
    recipeMode: string,
};

export type SettingStatusData = {
    status: string,
    exportTime?: string,
};

export type SettingsListData = {
    settings: SettingMetaData[],
    currentSetting: SettingDetailsData,
};

export type SidebarEntityData = {
    type: SidebarEntityType,
    name: string,
    label: string,
    pinnedPosition: number,
    lastViewTime: string,
};
