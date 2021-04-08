import { debounce } from "throttle-debounce";
import { PortalApi, portalApi } from "../api/PortalApi";
import { Config } from "../util/config";
import { CombinationId } from "./CombinationId";
import { NamesByTypesSet } from "./NamesByTypesSet";

class IconManager {
    private readonly portalApi: PortalApi;

    private readonly styleElement: HTMLElement;
    private readonly debounceRequestStyle: () => void;

    private readonly requestedIcons = new NamesByTypesSet();
    private readonly processedIcons = new NamesByTypesSet();

    public constructor(portalApi: PortalApi) {
        this.portalApi = portalApi;

        this.styleElement = document.createElement("style");
        document.head.appendChild(this.styleElement);

        this.debounceRequestStyle = debounce(10, this.requestStyle.bind(this));
    }

    public requestIcon(type: string, name: string): void {
        if (this.processedIcons.has(type, name)) {
            return;
        }

        this.processedIcons.add(type, name);
        this.requestedIcons.add(type, name);

        if (this.requestedIcons.size > Config.numberOfIconsPerRequest) {
            this.requestStyle();
        } else {
            this.debounceRequestStyle();
        }
    }

    private requestStyle(): void {
        if (this.requestedIcons.size === 0) {
            return;
        }

        const namesByTypes = this.requestedIcons.getData();
        this.requestedIcons.clear();

        (async () => {
            try {
                const response = await this.portalApi.getIconsStyle(namesByTypes);
                this.styleElement.appendChild(document.createTextNode(response.style));
                this.processedIcons.merge(response.processedEntities);
            } catch (e) {
                // Ignore any failures while loading icons.
            }
        })();
    }
}

class ModIconManager {
    private readonly portalApi: PortalApi;

    private readonly styleElements = new Map<string, HTMLElement>();
    private readonly debounceRequestStyle: () => void;

    private readonly requestedIcons = new NamesByTypesSet();
    private readonly processedIcons = new NamesByTypesSet();

    public constructor(portalApi: PortalApi) {
        this.portalApi = portalApi;

        this.debounceRequestStyle = debounce(10, this.requestStyle.bind(this));
    }

    public requestIcon(combinationId: string, modName: string): void {
        this.switchStyle(combinationId);
        if (this.processedIcons.has(combinationId, modName)) {
            return;
        }

        this.processedIcons.add(combinationId, modName);
        this.requestedIcons.add(combinationId, modName);

        if (this.requestedIcons.size > Config.numberOfIconsPerRequest) {
            this.requestStyle();
        } else {
            this.debounceRequestStyle();
        }
    }

    private requestStyle(): void {
        if (this.requestedIcons.size === 0) {
            return;
        }

        const data = this.requestedIcons.getData();
        this.requestedIcons.clear();

        (async () => {
            const requests: Promise<void>[] = [];
            for (const [combinationId, modNames] of Object.entries(data)) {
                requests.push(this.requestStyleOfMod(combinationId, modNames));
            }

            await Promise.allSettled(requests);
        })();
    }

    private async requestStyleOfMod(combinationId: string, modNames: string[]): Promise<void> {
        try {
            const portalApi = this.portalApi.withCombinationId(CombinationId.fromFull(combinationId));
            const response = await portalApi.getIconsStyle({ mod: modNames });
            this.getStyleElement(combinationId).appendChild(document.createTextNode(response.style));
            this.processedIcons.merge({ [combinationId]: response.processedEntities.mod || [] });
        } catch {
            // Ignore any failures while loading icons.
        }
    }

    private switchStyle(combinationId: string): void {
        this.styleElements.forEach((element) => {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        });

        document.head.appendChild(this.getStyleElement(combinationId));
    }

    private getStyleElement(combinationId: string): HTMLElement {
        let element = this.styleElements.get(combinationId);
        if (!element) {
            element = document.createElement("style");
            this.styleElements.set(combinationId, element);
        }
        return element;
    }
}

export const iconManager = new IconManager(portalApi);
export const modIconManager = new ModIconManager(portalApi);
