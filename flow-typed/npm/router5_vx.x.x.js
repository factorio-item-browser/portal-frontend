// flow-typed signature: 40811a0cb92dc6d1377417f1ec0088b5
// flow-typed version: <<STUB>>/router5_v8.0.1/flow_v0.143.1
// This definition is partial and only declares as much as needed to have flow run successfully on this project.

declare module 'router5' {
    declare export type DoneFn = (err?: any, state?: State) => void;
    declare export type CancelFn = () => void;
    declare export type Unsubscribe = () => void;

    declare export type Params = {[string]: string};
    declare interface Route {
        name: string;
        path: string;
        canActivate?: any;
        forwardTo?: string;
        children?: Route[];
        defaultParams?: Params;
    }

    declare export interface StateMeta {
        id: number;
        params: Params;
        options: NavigationOptions;
        redirected: boolean;
        source?: string;
    }
    declare export interface NavigationOptions {
        replace?: boolean;
        reload?: boolean;
        skipTransition?: boolean;
        force?: boolean;
        [key: string]: any;
    }

    declare export function createRouter(): Router;
    declare export type Middleware = (State, State, DoneFn) => boolean | Promise<any> | void;

    declare export interface Router {
        setOption(string, any): Router;
        buildPath(string, ?Params): string;
        usePlugin(any): Unsubscribe;
        useMiddleware(Middleware): Unsubscribe;
        subscribe(any): Unsubscribe;
        start(DoneFn): Router;
        add(Route[] | Route): Router;
        isActive(string, ?Params, ?boolean, ?boolean): boolean;
        navigate(string, Params, ?DoneFn): CancelFn;
    }

    declare export interface State {
        name: string;
        params: Params;
        path: string;
        meta?: StateMeta;
    }

    declare export interface SubscribeState {
        route: State;
        previousRoute: State;
    }

    declare export interface ErrorCodes {
        ROUTER_NOT_STARTED: string;
        NO_START_PATH_OR_STATE: string;
        ROUTER_ALREADY_STARTED: string;
        ROUTE_NOT_FOUND: string;
        SAME_STATES: string;
        CANNOT_DEACTIVATE: string;
        CANNOT_ACTIVATE: string;
        TRANSITION_ERR: string;
        TRANSITION_CANCELLED: string;
    }
    declare export interface Constants {
        UNKNOWN_ROUTE: string;
        ROUTER_START: string;
        ROUTER_STOP: string;
        TRANSITION_START: string;
        TRANSITION_CANCEL: string;
        TRANSITION_SUCCESS: string;
        TRANSITION_ERROR: string;
    }
    declare export var errorCodes: ErrorCodes;
    declare export var constants: Constants;
}
