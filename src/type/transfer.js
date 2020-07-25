// @flow

export type ItemType = "item" | "fluid";
export type NamesByTypes = { [string]: string[] };
export type SidebarEntityType = "item" | "fluid" | "recipe";

export interface EntityData {
    type: string;
    name: string;
    label: string;
    recipes: RecipeData[];
    numberOfRecipes: number;
}

export interface IconsStyleData {
    processedEntities: NamesByTypes;
    style: string;
}

export interface InitData {
    setting: SettingMetaData;
    settingHash: string;
    locale: string;
    sidebarEntities: SidebarEntityData[];
    scriptVersion: string;
}

export interface ItemRecipesData {
    type: ItemType;
    name: string;
    label: string;
    description: string;
    results: EntityData[];
    numberOfResults: number;
}

export interface MachineData {
    name: string;
    label: string;
    craftingSpeed: number;
    numberOfItems: number;
    numberOfFluids: number;
    numberOfModules: number;
    energyUsage: number;
    energyUsageUnit: string;
}

export interface ModData {
    name: string;
    label: string;
    author: string;
    version: string;
}

export interface RecipeData {
    craftingTime: number;
    ingredients: RecipeItemData[];
    products: RecipeItemData[];
    isExpensive: boolean;
}

export interface RecipeDetailsData {
    name: string;
    label: string;
    description: string;
    recipe?: RecipeData;
    expensiveRecipe?: RecipeData;
}

export interface RecipeItemData {
    type: ItemType;
    name: string;
    label: string;
    amount: number;
}

export interface RecipeMachinesData {
    results: MachineData[];
    numberOfResults: number;
}

export interface SearchResultsData {
    query: string;
    results: EntityData[];
    numberOfResults: number;
}

export interface SettingCreateData extends SettingOptionsData {
    modNames: string[];
}

export interface SettingDetailsData extends SettingMetaData, SettingOptionsData {
    mods: ModData[];
    modIconsStyle: IconsStyleData;
}

export interface SettingMetaData {
    combinationId: string;
    name: string;
    status: string;
}

export interface SettingOptionsData {
    name: string;
    locale: string;
    recipeMode: string;
}

export interface SettingStatusData {
    status: string;
    exportTime?: string;
}

export interface SettingsListData {
    settings: SettingMetaData[];
    currentSetting: SettingDetailsData;
}

export interface SidebarEntityData {
    type: SidebarEntityType;
    name: string;
    label: string;
    pinnedPosition: number;
    lastViewTime: string;
}
