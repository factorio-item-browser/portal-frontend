import { portalApi } from "./PortalApi";
import { debounce } from "../helper/utils";

/**
 * The class managing the icons, requesting them from the Portal API as required.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */
class IconManager {
    /**
     * The portal API instance.
     * @type {PortalApi}
     * @private
     */
    _portalApi;

    /**
     * The debounce handler for the style request.
     * @type {Function}
     */
    _debounceRequestStyle;

    /**
     * The style element holding the loaded styles.
     * @type {Node}
     * @private
     */
    _styleElement;

    /**
     * The already processed entities. These entities do not need to be requested from the backend anymore.
     * @type {object<string, object<string, true>>}
     * @private
     */
    _processedEntities = {};

    /**
     * The requested entities. These entities must be loaded with the next request.
     * @type {object<string, object<string, true>>}
     * @private
     */
    _requestedEntities = {};

    /**
     * Initializes the icon manager.
     * @param {PortalApi} portalApi
     */
    constructor(portalApi) {
        this._portalApi = portalApi;

        this._debounceRequestStyle = debounce(this._requestStyle, 10, this);
        this._styleElement = document.createElement("style");
        document.head.appendChild(this._styleElement);
    }

    /**
     * Requests the icon of type and name to be loaded, if not already present.
     * @param {string} type
     * @param {string} name
     */
    requestIcon(type, name) {
        if (
            !this._hasValue(this._processedEntities, type, name) &&
            !this._hasValue(this._requestedEntities, type, name)
        ) {
            this._addValue(this._requestedEntities, type, name);
        }

        this._debounceRequestStyle();
    }

    /**
     * Checks whether the value is present in the object structure.
     * @param {object<string, object<string, true>>} entities
     * @param {string} type
     * @param {string} name
     * @returns {boolean}
     * @private
     */
    _hasValue(entities, type, name) {
        return typeof entities[type] === "object" && !!entities[type][name];
    }

    /**
     * Adds a value to the object structure.
     * @param {object<string, object<string, true>>} entities
     * @param {string} type
     * @param {string} name
     * @private
     */
    _addValue(entities, type, name) {
        if (!entities[type]) {
            entities[type] = {};
        }
        entities[type][name] = true;
    }

    /**
     * Requests the style of the entities marked as to be requested.
     * @returns {Promise<void>}
     * @private
     */
    async _requestStyle() {
        const namesByTypes = this._extractNamesByTypes(this._requestedEntities);

        try {
            const response = await this._portalApi.getIconsStyle(namesByTypes);
            this._appendStyle(response.style);

            this._addToProcessedEntities(namesByTypes); // If entities do not have icons, don't try to re-request.
            this._addToProcessedEntities(response.processedEntities);
            this._requestedEntities = {};
        } catch (e) {
            // Ignore any failures to to failed style requests.
        }
    }

    /**
     * Extracts the types and names from the entity object structure.
     * @param {object<string, object<string, true>>} entities
     * @returns {NamesByTypes}
     * @private
     */
    _extractNamesByTypes(entities) {
        const namesByTypes = {};
        Object.keys(entities).forEach((type) => {
            namesByTypes[type] = [];
            Object.keys(entities[type]).forEach((name) => {
                namesByTypes[type].push(name);
            });
        });
        return namesByTypes;
    }

    /**
     *
     * @param {NamesByTypes} processedEntities
     * @private
     */
    _addToProcessedEntities(processedEntities) {
        Object.keys(processedEntities).forEach((type) => {
            processedEntities[type].forEach((name) => {
                this._addValue(this._processedEntities, type, name);
            });
        });
    }

    /**
     * Appends some content to the stylesheet.
     * @param {string} style
     * @private
     */
    _appendStyle(style) {
        const text = document.createTextNode(style);
        this._styleElement.appendChild(text);
    }
}

export const iconManager = new IconManager(portalApi);
