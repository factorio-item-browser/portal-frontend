/**
 * File including type definitions for the transfer object structures received from the Portal API.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */

interface EntityData {
    type: string,
    name: string,
    label: string,
    recipes: RecipeData[],
    numberOfRecipes: number,
}

interface IconsStyleData {
    processedEntities: NamesByTypes,
    style: string,
}

interface ItemRecipesData {
    type: string,
    name: string,
    label: string,
    description: string,
    results: EntityData[],
    numberOfResults: number,
}

interface MachineData {
    name: string,
    label: string,
    craftingSpeed: number,
    numberOfItems: number,
    numberOfFluids: number,
    numberOfModules: number,
    energyUsage: number,
    energyUsageUnit: string,
}

interface ModData {
    name: string,
    label: string,
    author: string,
    version: string,
}

interface NamesByTypes {
    [key: string]: string[],
}

interface RecipeData {
    craftingTime: number,
    ingredients: RecipeItemData[],
    products: RecipeItemData[],
    isExpensive: boolean,
}

interface RecipeDetailsData {
    name: string,
    label: string,
    description: string,
    recipe?: RecipeData,
    expensiveRecipe?: RecipeData,
}

interface RecipeItemData {
    type: string,
    name: string,
    label: string,
    amount: number,
}

interface RecipeMachinesData {
    results: MachineData[],
    numberOfResults: number,
}

interface SearchResultsData {
    query: string,
    results: EntityData[],
    numberOfResults: number,
}

interface SessionInitData {
    settingName: string,
    locale: string,
    sidebarEntities: SidebarEntityData[],
}

interface SettingDetailsData extends SettingMetaData, SettingOptionsData {
    mods: ModData[],
}

interface SettingMetaData {
    id: string,
    name: string,
}

interface SettingOptionsData {
    locale: string,
    recipeMode: string,
}

interface SettingsListData {
    settings: SettingMetaData[],
    currentSetting: SettingDetailsData,
}

interface SidebarEntityData {
    type: string,
    name: string,
    label: string,
    pinnedPosition: number,
    lastViewTime: string,
}
