/**
 * File including type definitions for the object structures received from the backend.
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

interface RecipeData {
    craftingTime: number,
    ingredients: RecipeItemData[],
    products: RecipeItemData[],
    isExpensive: boolean,
}

interface RecipeItemData {
    type: string,
    name: string,
    amount: number,
}
