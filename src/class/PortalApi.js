class PortalApi {
    /**
     *
     * @param searchQuery
     * @returns {Promise<SearchResultsData>}
     */
    async searchQuery(searchQuery) {
        const entityData = {
            type: "item",
            name: "electronic-circuit",
            label: "Elektronischer Schaltkreis",
            recipes: [
                {
                    ingredients: [
                        {
                            type: "item",
                            name: "iron-plate",
                            label: "Eisenplatte",
                            amount: 1,
                        },
                        {
                            type: "item",
                            name: "copper-cable",
                            label: "Kupferkabel",
                            amount: 3,
                        },
                    ],
                    products: [
                        {
                            type: "item",
                            name: "electronic-circuit",
                            label: "Elektronischer Schaltkreis",
                            amount: 1,
                        },
                    ],
                    craftingTime: 0.5,
                    isExpensive: false,
                },
                {
                    ingredients: [
                        {
                            type: "item",
                            name: "iron-plate",
                            label: "Eisenplatte",
                            amount: 2,
                        },
                        {
                            type: "item",
                            name: "copper-cable",
                            label: "Kupferkabel",
                            amount: 10,
                        },
                    ],
                    products: [
                        {
                            type: "item",
                            name: "electronic-circuit",
                            label: "Elektronischer Schaltkreis",
                            amount: 1,
                        },
                    ],
                    craftingTime: 0.5,
                    isExpensive: true,
                },
            ],
        };
        const data = {
            query: searchQuery,
            results: [entityData, entityData, entityData, entityData, entityData, entityData],
            count: 42,
        };

        return new window.Promise((resolve) => {
            window.setTimeout(() => {
                resolve(data);
            }, 1000);
        });
    }

    /**
     *
     * @param {string} type
     * @param {string} name
     * @returns {Promise<ItemDetailsData>}
     */
    requestItemDetails(type, name) {
        const data = {
            type: type,
            name: name,
            label: "Kupferkabel",
            description:
                "Kann mit Linke Maustaste zum Verbinden und Trennen von Strommasten und Stromschaltern verwendet werden.",
            ingredientRecipes: [
                {
                    type: "recipe",
                    name: "copper-cable",
                    label: "Kupferkabel",
                    recipes: [
                        {
                            ingredients: [
                                {
                                    type: "item",
                                    name: "copper-plate",
                                    label: "Kupferplatte",
                                    amount: 1,
                                },
                            ],
                            products: [
                                {
                                    type: "item",
                                    name: "copper-cable",
                                    label: "Kupferkabel",
                                    amount: 2,
                                },
                            ],
                            craftingTime: 0.5,
                            isExpensive: false,
                        },
                    ],
                    omittedRecipes: 0,
                },
            ],
            ingredientRecipeCount: 1,
            productRecipes: [],
            productRecipeCount: 0,
        };

        return new window.Promise((resolve) => {
            window.setTimeout(() => {
                resolve(data);
            }, 1000);
        });
    }

    requestRecipeDetails(name) {
        const data = {
            name: name,
            label: "Some fancy shit",
            description: "Lorem ipsum dolor sit amet.",
            recipe: {
                craftingTime: 0.5,
                ingredients: [
                    {
                        type: "item",
                        name: "iron-plate",
                        label: "Eisenplatte",
                        amount: 9,
                    },
                    {
                        type: "item",
                        name: "iron-gear-wheel",
                        label: "Eisenzahnrad",
                        amount: 5,
                    },
                    {
                        type: "item",
                        name: "electronic-circuit",
                        label: "Elektronischer Schaltkreis",
                        amount: 3,
                    },
                    {
                        type: "item",
                        name: "assembling-machine-1",
                        label: "Montagemaschine 1",
                        amount: 1,
                    },
                ],
                products: [
                    {
                        type: "item",
                        name: "assembling-machine-2",
                        label: "Montagemaschine 2",
                        amount: 1,
                    },
                ],
                isExpensive: false,
            },
            expensiveRecipe: {
                craftingTime: 0.5,
                    ingredients: [
                    {
                        type: "item",
                        name: "iron-plate",
                        label: "Eisenplatte",
                        amount: 20,
                    },
                    {
                        type: "item",
                        name: "iron-gear-wheel",
                        label: "Eisenzahnrad",
                        amount: 10,
                    },
                    {
                        type: "item",
                        name: "electronic-circuit",
                        label: "Elektronischer Schaltkreis",
                        amount: 5,
                    },
                    {
                        type: "item",
                        name: "assembling-machine-1",
                        label: "Montagemaschine 1",
                        amount: 1,
                    },
                ],
                    products: [
                    {
                        type: "item",
                        name: "assembling-machine-2",
                        label: "Montagemaschine 2",
                        amount: 1,
                    },
                ],
                isExpensive: true,
            },
            machines: [
                {
                    name: "player",
                    label: "Character",
                    craftingSpeed: 1,
                },
                {
                    name: "assembling-machine-1",
                    label: "Assembling Machine 1",
                    craftingSpeed: 0.5,
                },
            ],
        };

        return new window.Promise((resolve) => {
            window.setTimeout(() => {
                resolve(data);
            }, 1000);
        });
    }
}

export const portalApi = new PortalApi();
export default PortalApi;
