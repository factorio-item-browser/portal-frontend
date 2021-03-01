import { action, makeObservable, observable } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import { iconManager, IconManager } from "../class/IconManager";
import { router, Router } from "../class/Router";
import { Route } from "../const/route";

type Entity = {
    type: string;
    name: string;
};

const emptyEntity: Entity = {
    type: "",
    name: "",
};

export class IconStore {
    private readonly iconManager: IconManager;

    /** The entity which should currently be highlighted. */
    public highlightedEntity: Entity = emptyEntity;

    public constructor(iconManager: IconManager, router: Router) {
        this.iconManager = iconManager;

        makeObservable<this, "handleGlobalRouteChange">(this, {
            handleGlobalRouteChange: action,
            highlightedEntity: observable,
        });

        router.addGlobalChangeHandler(this.handleGlobalRouteChange.bind(this));
    }

    private handleGlobalRouteChange(state: State): void {
        switch (state.name) {
            case Route.ItemDetails:
                this.highlightedEntity = {
                    type: state.params.type,
                    name: state.params.name,
                };
                break;

            case Route.RecipeDetails:
                this.highlightedEntity = {
                    type: "recipe",
                    name: state.params.name,
                };
                break;

            default:
                this.highlightedEntity = emptyEntity;
                break;
        }
    }
}

export const iconStore = new IconStore(iconManager, router);
export const iconStoreContext = createContext(iconStore);
