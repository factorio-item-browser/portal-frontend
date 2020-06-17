import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";
import { getI18n } from "react-i18next";
import { constants, createRouter } from "router5";
import browserPluginFactory from "router5-plugin-browser";

import { cacheManager } from "../class/CacheManager";
import { portalApi } from "../class/PortalApi";
import {
    ERROR_CLIENT_FAILURE,
    ERROR_INCOMPATIBLE_CLIENT,
    ERROR_SERVER_FAILURE,
    ERROR_SERVICE_NOT_AVAILABLE,
    ROUTE_INDEX,
    ROUTE_ITEM_DETAILS,
    ROUTE_RECIPE_DETAILS,
    ROUTE_SETTINGS,
    ROUTE_SETTINGS_NEW,
    SETTING_STATUS_AVAILABLE,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
    STORAGE_KEY_SCRIPT_VERSION,
} from "../helper/const";

/**
 * The map from the entity types to their corresponding routes.
 * @type {Object<string, string>}
 */
const entityTypeToRouteMap = {
    item: ROUTE_ITEM_DETAILS,
    fluid: ROUTE_ITEM_DETAILS,
    recipe: ROUTE_RECIPE_DETAILS,
};

/**
 * The store handling the pages, including routing between them.
 */
class RouteStore {
    /**
     * The cache manager.
     * @type {CacheManager}
     * @private
     */
    _cacheManager;

    /**
     * The portal API instance.
     * @type {PortalApi}
     * @private
     */
    _portalApi;

    /**
     * The change handlers of the routes.
     * @type {object<string,Function>}
     * @private
     */
    _changeHandlers = {};

    /**
     * The handlers for initialising the session.
     * @type {(function(SessionInitData): void)[]}
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
     * @param {CacheManager} cacheManager
     * @param {PortalApi} portalApi
     */
    constructor(cacheManager, portalApi) {
        this._cacheManager = cacheManager;
        this._portalApi = portalApi;

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
        this.currentRoute = state.route.name;

        for (const handler of this._routeChangeHandlers) {
            handler(state);
        }

        window.scrollTo(0, 0);
    }

    /**
     * Initializes the session
     * @param {SessionInitData} session
     * @private
     */
    @action
    async _initializeSession(session) {
        this.setting = session.setting;
        this.locale = session.locale;

        this._cacheManager.setSettingHash(session.settingHash);
        await getI18n().changeLanguage(session.locale);
    }

    /**
     * Adds a route to be handled.
     * @param {string} name
     * @param {string} path
     * @param {Function} [changeHandler]
     */
    addRoute(name, path, changeHandler) {
        this._router.add([{ name, path }]);

        if (changeHandler) {
            this._changeHandlers[name] = changeHandler;
        }
    }

    /**
     * Adds a handler for initializing the session.
     * @param {function(SessionInitData): void} handler
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

        const currentScriptVersion = window.localStorage.getItem(STORAGE_KEY_SCRIPT_VERSION);
        if (!currentScriptVersion) {
            // Don't have a script version stored? Then we may be coming from a redirect. Write version and done.
            window.localStorage.setItem(STORAGE_KEY_SCRIPT_VERSION, requiredScriptVersion);
            return true;
        }

        if (currentScriptVersion === requiredScriptVersion) {
            // Script version did not change, so everything is fine.
            return true;
        }

        window.localStorage.removeItem(STORAGE_KEY_SCRIPT_VERSION);
        if (window.localStorage.getItem(STORAGE_KEY_SCRIPT_VERSION)) {
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
        return this._router.buildPath(route, params);
    }

    /**
     * Redirects to the index page, to e.g. apply a new setting. This is a hard refresh of the page.
     */
    redirectToIndex() {
        location.assign(this.buildPath(ROUTE_INDEX));
    }

    /**
     * Returns the route and params used to link to the entity.
     * @param {string} type
     * @param {string} name
     * @returns {{route: string, params: Object<string,any>}}
     */
    getRouteAndParamsForEntity(type, name) {
        const route = entityTypeToRouteMap[type];
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
        return [ROUTE_SETTINGS, ROUTE_SETTINGS_NEW].indexOf(this.currentRoute) === -1;
    }

    /**
     * Checks the current status of the setting, if its data is still not available.
     * @return {Promise<void>}
     */
    async checkSettingStatus() {
        if (this.setting.status === SETTING_STATUS_PENDING || this.setting.status === SETTING_STATUS_UNKNOWN) {
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

export const routeStore = new RouteStore(cacheManager, portalApi);
export default createContext(routeStore);
