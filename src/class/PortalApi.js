

class PortalApi {
    /**
     *
     * @param searchQuery
     * @returns {Promise<SearchResultsPageData>}
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
                            amount: 1,
                        },
                        {
                            type: "item",
                            name: "copper-cable",
                            amount: 3,
                        },
                    ],
                    products: [
                        {
                            type: "item",
                            name: "electronic-circuit",
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
                            amount: 2,
                        },
                        {
                            type: "item",
                            name: "copper-cable",
                            amount: 10,
                        },
                    ],
                    products: [
                        {
                            type: "item",
                            name: "electronic-circuit",
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

        return new window.Promise(
            (resolve) => {
                window.setTimeout(() => {
                    resolve(data);
                }, 1000);
            }
        );
    }
}

export const portalApi = new PortalApi();
export default PortalApi;
