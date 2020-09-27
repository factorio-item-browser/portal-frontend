// @flow

import { debounce } from "throttle-debounce";
import { NUMBER_OF_ICONS_PER_REQUEST } from "../const/config";
import type { IconsStyleData } from "../type/transfer";
import NamesByTypesSet from "./NamesByTypesSet";
import { PortalApi, portalApi } from "./PortalApi";

/**
 * The class managing the icons, requesting them from the Portal API as required.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */
export class IconManager {
    /**
     * @private
     */
    _portalApi: PortalApi;

    /**
     * @private
     */
    _debounceRequestStyle: () => void;

    /**
     * @private
     */
    _styleElement: Node;

    /**
     * @private
     */
    _additionalStyleElements: Map<string, Node> = new Map();

    /**
     * The requested entities. These entities must be loaded with the next request.
     * @private
     */
    _requestedEntities: NamesByTypesSet = new NamesByTypesSet();

    /**
     * The entities already requested from the server, but still pending.
     * @private
     */
    _pendingEntities: NamesByTypesSet = new NamesByTypesSet();

    /**
     * The already processed entities. These entities do not need to be requested from the backend anymore.
     * @private
     */
    _processedEntities: NamesByTypesSet = new NamesByTypesSet();

    constructor(portalApi: PortalApi) {
        this._portalApi = portalApi;

        this._debounceRequestStyle = debounce(10, this._requestStyle.bind(this));
        this._styleElement = document.createElement("style");
        document.head?.appendChild(this._styleElement);
    }

    /**
     * Requests the icon of type and name to be loaded, if not already present.
     */
    requestIcon(type: string, name: string): void {
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
    _requestStyle(): void {
        if (this._requestedEntities.size > 0) {
            const namesByTypes = this._requestedEntities.getData();
            this._pendingEntities.merge(namesByTypes);
            this._requestedEntities.clear();

            (async (): Promise<void> => {
                try {
                    const response = await this._portalApi.getIconsStyle(namesByTypes);
                    this._appendStyle(response.style);

                    this._processedEntities.merge(response.processedEntities);
                } catch (e) {
                    // Ignore any failures to failed style requests.
                }
                this._pendingEntities.diff(namesByTypes);
            })();
        }
    }

    /**
     * @private
     */
    _appendStyle(style: string): void {
        const text = document.createTextNode(style);
        this._styleElement.appendChild(text);
    }

    /**
     * Adds an additional (preloaded) style to the icon manager.
     */
    addAdditionalStyle(name: string, style: IconsStyleData) {
        const element = this._additionalStyleElements.get(name);
        if (element) {
            element.textContent = style.style;
        } else {
            const node = document.createTextNode(style.style);
            this._additionalStyleElements.set(name, node);
            this._styleElement.appendChild(node);
        }
        this._processedEntities.merge(style.processedEntities);
    }
}

export const iconManager = new IconManager(portalApi);
