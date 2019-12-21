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
    omittedRecipes: number,
}

interface MachineData {
    name: string,
    label: string,
    craftingSpeed: number,
}

interface RecipeData {
    craftingTime: number,
    ingredients: RecipeItemData[],
    products: RecipeItemData[],
    isExpensive: boolean,
}

interface RecipeItemData {
    type: string,
    name: string,
    label: string,
    amount: number,
}

interface SidebarEntityData {
    type: string,
    name: string,
    label: string,
    pinnedPosition: number,
    lastViewTime: string,
}

interface SearchResultsData {
    query: string,
    results: EntityData[],
    numberOfResults: number,
}

interface ItemDetailsData {
    type: string,
    name: string,
    label: string,
    description: string,
    ingredientRecipes: EntityData[],
    ingredientRecipeCount: number,
    productRecipes: EntityData[],
    productRecipeCount: number,
}

interface RecipeDetailsData {
    name: string,
    label: string,
    description: string,
    recipe: RecipeData,
    expensiveRecipe?: RecipeData,
    machines: MachineData[],
}