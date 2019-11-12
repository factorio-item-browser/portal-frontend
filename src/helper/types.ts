/**
 * File including type definitions for the object structures received from the backend.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */

interface Recipe {
    craftingTime: number,
    ingredients: RecipeItem[]
    products: RecipeItem[]
}

interface RecipeItem {
    type: string
    name: string
    amount: number
}
