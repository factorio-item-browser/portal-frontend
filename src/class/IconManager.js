import { portalApi } from "./PortalApi";
import NamesByTypesSet from "./NamesByTypesSet";
import { debounce } from "../helper/utils";

const NUMBER_OF_ICONS_PER_REQUEST = 128;

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
     * The requested entities. These entities must be loaded with the next request.
     * @type {NamesByTypesSet}
     * @private
     */
    _requestedEntities = new NamesByTypesSet();

    /**
     * The entities already requested from the server, but still pending.
     * @type {NamesByTypesSet}
     * @private
     */
    _pendingEntities = new NamesByTypesSet();

    /**
     * The already processed entities. These entities do not need to be requested from the backend anymore.
     * @type {NamesByTypesSet}
     * @private
     */
    _processedEntities = new NamesByTypesSet();

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
            !this._requestedEntities.has(type, name) &&
            !this._pendingEntities.has(type, name) &&
            !this._processedEntities.has(type, name)
        ) {
            this._requestedEntities.add(type, name);

            if (this._requestedEntities.size >= NUMBER_OF_ICONS_PER_REQUEST) {
                this._requestStyle();
            }
        }

        this._debounceRequestStyle();
    }

    /**
     * Requests the style of the entities marked as to be requested.
     * @private
     */
    _requestStyle() {
        if (this._requestedEntities.size > 0) {
            const namesByTypes = this._requestedEntities.getData();
            this._pendingEntities.merge(namesByTypes);
            this._requestedEntities.clear();

            (async () => {
                try {
                    const response = await this._portalApi.getIconsStyle(namesByTypes);
                    this._appendStyle(response.style);

                    this._processedEntities.merge(response.processedEntities);
                } catch (e) {
                    // Ignore any failures to to failed style requests.
                }
                this._pendingEntities.diff(namesByTypes);
            })();
        }
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
