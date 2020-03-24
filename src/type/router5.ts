/**
 * File redefining some of the router5 types because IDE cannot resolve them without help somehow.
 */
import {Params, StateMeta} from "router5/dist/types/base";

interface State {
    name: string;
    params: Params;
    path: string;
    meta?: StateMeta;
}
interface SubscribeState {
    route: State;
    previousRoute: State;
}
