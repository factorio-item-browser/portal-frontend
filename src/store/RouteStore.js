import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";
import { getI18n } from "react-i18next";
import { constants, createRouter } from "router5";
import browserPluginFactory from "router5-plugin-browser";

import { portalApi } from "../class/PortalApi";
import {
    ERROR_CLIENT_FAILURE,
    ERROR_INCOMPATIBLE_CLIENT,
    ERROR_SERVER_FAILURE,
    ERROR_SERVICE_NOT_AVAILABLE,
    SETTING_STATUS_AVAILABLE,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
} from "../helper/const";
import {
    ROUTE_INDEX,
    ROUTE_ITEM_DETAILS,
    ROUTE_RECIPE_DETAILS,
    ROUTE_SETTINGS,
    ROUTE_SETTINGS_NEW,
} from "../const/route";
import { storageManager } from "../class/StorageManager";
import CombinationId from "../class/CombinationId";

const SHORT_ROUTE_SUFFIX = "-short";
const ROUTE_PARAM_COMBINATION_ID = "combination-id";

/**
 * The map from the entity types to their corresponding routes.
 * @type {Object<string, string>}
 */
const MAP_ENTITY_TYPE_TO_ROUTE = {
    item: ROUTE_ITEM_DETAILS,
    fluid: ROUTE_ITEM_DETAILS,
    recipe: ROUTE_RECIPE_DETAILS,
};

/**
 * The store handling the pages, including routing between them.
 */
class RouteStore {
    /**
     * The portal API instance.
     * @type {PortalApi}
     * @private
     */
    _portalApi;

    /**
     * The storage manager.
     * @type {StorageManager}
     * @private
     */
    _storageManager;

    /**
     * The change handlers of the routes.
     * @type {object<string,Function>}
     * @private
     */
    _changeHandlers = {};

    /**
     * The handlers for initialising the session.
     * @type {(function(InitData): void)[]}
     * @private
     */
    _initializeSessionHandlers = [];

    /**
     * The handlers called on every route change.
     * @type {function[]}
     * @private
     */
    _routeChangeHandlers = [];

    /**
     * The router of the store.
     * @type {Router}
     */
    _router;

    /**
     * The current route which is displayed.
     * @type {string}
     */
    @observable
    currentRoute = "";

    /**
     * The fatal error which occurred.
     * @type {string}
     */
    @observable
    fatalError = "";

    /**
     * The target which currently have the loading circle.
     * @type {React.RefObject<HTMLElement>}
     */
    @observable
    loadingCircleTarget = null;

    /**
     * The currently loaded setting.
     * @type {SettingMetaData}
     */
    @observable
    setting = {
        id: "",
        name: "Vanilla",
        status: SETTING_STATUS_AVAILABLE,
    };

    /**
     * The locale to use for the page.
     * @type {string}
     */
    @observable
    locale = "en";

    /**
     * Initializes the route store.
     * @param {PortalApi} portalApi
     * @param {StorageManager} storageManager
     */
    constructor(portalApi, storageManager) {
        this._portalApi = portalApi;
        this._storageManager = storageManager;

        this._router = this._createRouter();
        this.addInitializeSessionHandler(this._initializeSession.bind(this));
    }

    /**
     * Creates the router to use.
     * @returns {Router}
     * @private
     */
    _createRouter() {
        const router = createRouter();
        router.setOption("allowNotFound", true);
        router.usePlugin(browserPluginFactory());
        router.useMiddleware(this._getFetchDataHandlerMiddleware.bind(this));
        router.subscribe(this._handleChangeEvent.bind(this));
        return router;
    }

    /**
     * The middleware for handling the route changes.
     * @returns {function(State): boolean | Promise<any>}
     * @private
     */
    _getFetchDataHandlerMiddleware() {
        return (toState) => {
            let result = true;
            if (this._changeHandlers[toState.name]) {
                result = this._changeHandlers[toState.name](toState.params);
            }
            return result;
        };
    }

    /**
     * Handles the change event of the router.
     * @param {SubscribeState} state
     * @private
     */
    @action
    _handleChangeEvent(state) {
        if (state.route.name.endsWith(SHORT_ROUTE_SUFFIX)) {
            this.currentRoute = state.route.name.substr(0, state.route.name.length - SHORT_ROUTE_SUFFIX.length);
        } else {
            this.currentRoute = state.route.name;
        }

        for (const handler of this._routeChangeHandlers) {
            handler(state);
        }

        window.scrollTo(0, 0);
    }

    /**
     * Initializes the session
     * @param {InitData} session
     * @private
     */
    @action
    async _initializeSession(session) {
        this.setting = session.setting;
        this.locale = session.locale;

        const combinationId = CombinationId.fromFull(session.setting.combinationId);

        this._storageManager.combinationId = combinationId;
        this._router.setOption("defaultParams", {
            [ROUTE_PARAM_COMBINATION_ID]: combinationId.toShort(),
        });

        //this._cacheManager.setSettingHash(session.settingHash);
        await getI18n().changeLanguage(session.locale);
    }

    /**
     * Adds a route to be handled.
     * @param {string} name
     * @param {string} path
     * @param {Function} [changeHandler]
     */
    addRoute(name, path, changeHandler) {
        this._router.add([
            {
                name,
                path: `/:${ROUTE_PARAM_COMBINATION_ID}${path}`,
            },
            {
                name: name + SHORT_ROUTE_SUFFIX,
                path,
            },
        ]);

        if (changeHandler) {
            this._changeHandlers[name] = changeHandler;
            this._changeHandlers[name + SHORT_ROUTE_SUFFIX] = changeHandler;
        }
    }

    /**
     * Adds a handler for initializing the session.
     * @param {function(InitData): void} handler
     */
    addInitializeSessionHandler(handler) {
        this._initializeSessionHandlers.push(handler);
    }

    /**
     * Adds a handler called on every route change.
     * @param {function} handler
     */
    addRouteChangeHandler(handler) {
        this._routeChangeHandlers.push(handler);
    }

    /**
     * Whether we are still initially loading all the things.
     * @return {boolean}
     */
    @computed
    get isInitiallyLoading() {
        return this.currentRoute === "";
    }

    /**
     * Whether we are currently viewing an unknown route.
     * @return {boolean}
     */
    @computed
    get hasUnknownRoute() {
        return this.currentRoute === constants.UNKNOWN_ROUTE;
    }

    /**
     * Initializes the session.
     * @returns {Promise<void>}
     */
    async initializeSession() {
        try {
            const sessionData = await portalApi.initializeSession();
            if (this._hasCurrentScriptVersion(sessionData.scriptVersion)) {
                // Current script version is already loaded, so proceed as usual.
                for (const handler of this._initializeSessionHandlers) {
                    handler(sessionData);
                }
                this._router.start();
            } else {
                // Script version has changed, force a reload of the page to get the latest files.
                window.location.reload();
            }
        } catch (e) {
            this.handlePortalApiError(e);
        }
    }

    /**
     * Checks whether the current script version is already loaded.
     * @param {string} requiredScriptVersion
     * @return {boolean}
     * @private
     */
    _hasCurrentScriptVersion(requiredScriptVersion) {
        if (!requiredScriptVersion) {
            // Didn't receive any script version? Meh, disable the reload feature.
            return true;
        }

        const currentScriptVersion = this._storageManager.scriptVersion;
        if (!currentScriptVersion) {
            // Don't have a script version stored? Then we may be coming from a redirect. Write version and done.
            this._storageManager.scriptVersion = requiredScriptVersion;
            return true;
        }

        if (currentScriptVersion === requiredScriptVersion) {
            // Script version did not change, so everything is fine.
            return true;
        }

        this._storageManager.scriptVersion = "";
        if (this._storageManager.scriptVersion) {
            // Somehow we aren't able to remove the script version. So do not reload to avoid an infinite loop.
            return true;
        }

        // Force a reload because the script version has changed.
        return false;
    }

    /**
     * Handles an error thrown by the Portal API, by displaying a fatal error box.
     * @param {PortalApiError} error
     */
    handlePortalApiError(error) {
        if (error.code === 401) {
            this.fatalError = ERROR_INCOMPATIBLE_CLIENT;
        } else if (error.code === 409) {
            this.fatalError = ERROR_CLIENT_FAILURE;
        } else if (error.code === 503) {
            this.fatalError = ERROR_SERVICE_NOT_AVAILABLE;
        } else {
            this.fatalError = ERROR_SERVER_FAILURE;
        }

        console.log(error);
    }

    /**
     * Navigates to the specified route.
     * @param {string} route
     * @param {Object} [params]
     */
    navigateTo(route, params) {
        if (this._storageManager.combinationId) {
            params = {
                [ROUTE_PARAM_COMBINATION_ID]: this._storageManager.combinationId.toShort(),
                ...params,
            };
        }

        this._router.navigate(route, params, () => {
            runInAction(() => {
                this.loadingCircleTarget = null;
            });
        });
    }

    /**
     * Builds the path to the specified route.
     * @param {string} route
     * @param {Object} [params]
     * @returns {string}
     */
    buildPath(route, params) {
        if (this._storageManager.combinationId) {
            params = {
                [ROUTE_PARAM_COMBINATION_ID]: this._storageManager.combinationId.toShort(),
                ...params,
            };
        }
        return this._router.buildPath(route, params);
    }

    /**
     * Redirects to the index page, to e.g. apply a new setting. This is a hard refresh of the page.
     * @param {CombinationId} [combinationId]
     */
    redirectToIndex(combinationId) {
        const params = combinationId ? { ROUTE_PARAM_COMBINATION_ID: combinationId.toShort() } : undefined;
        location.assign(this.buildPath(ROUTE_INDEX, params));
    }

    /**
     * Returns the route and params used to link to the entity.
     * @param {string} type
     * @param {string} name
     * @returns {{route: string, params: Object<string,any>}}
     */
    getRouteAndParamsForEntity(type, name) {
        const route = MAP_ENTITY_TYPE_TO_ROUTE[type];
        if (route) {
            return {
                route: route,
                params: { type: type, name: name },
            };
        }

        return {
            route: ROUTE_INDEX,
            params: {},
        };
    }

    /**
     * Whether to use the big version of the header.
     * @returns {boolean}
     */
    @computed
    get useBigHeader() {
        return this.currentRoute === ROUTE_INDEX;
    }

    /**
     * Shows the loading circle overlaying the passed reference object.
     * @param {React.RefObject<HTMLElement>} ref
     */
    @action
    showLoadingCircle(ref) {
        this.loadingCircleTarget = ref;
    }

    /**
     * Returns whether the global setting status should be shown.
     * @return {boolean}
     */
    @computed
    get showGlobalSettingStatus() {
        return ![ROUTE_SETTINGS, ROUTE_SETTINGS_NEW].includes(this.currentRoute);
    }

    /**
     * Checks the current status of the setting, if its data is still not available.
     * @return {Promise<void>}
     */
    async checkSettingStatus() {
        if ([SETTING_STATUS_PENDING, SETTING_STATUS_UNKNOWN].includes(this.setting.status)) {
            try {
                const settingStatus = await this._portalApi.getSettingStatus();
                if (settingStatus.status === SETTING_STATUS_AVAILABLE) {
                    window.location.reload();
                } else {
                    runInAction(() => {
                        this.setting.status = settingStatus.status;
                    });
                }
            } catch (e) {
                // Ignore any errors related to checking the setting status.
            }
        }
    }
}

export const routeStore = new RouteStore(portalApi, storageManager);
export default createContext(routeStore);
