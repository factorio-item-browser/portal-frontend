import { ROUTE_INDEX, ROUTE_ITEM_DETAILS, ROUTE_RECIPE_DETAILS } from "../const/route";

const MAP_ENTITY_TYPE_TO_ROUTE: { [key: string]: string } = {
    item: ROUTE_ITEM_DETAILS,
    fluid: ROUTE_ITEM_DETAILS,
    recipe: ROUTE_RECIPE_DETAILS,
};

type RouteAndParams = {
    route: string;
    params: { [key: string]: unknown };
};

/**
 * Returns the route and params used to link to the entity.
 */
export function getRouteAndParamsForEntity(type: string, name: string): RouteAndParams {
    const route = MAP_ENTITY_TYPE_TO_ROUTE[type];
    if (route) {
        return {
            route: route,
            params: { type, name },
        };
    }

    return {
        route: ROUTE_INDEX,
        params: {},
    };
}
