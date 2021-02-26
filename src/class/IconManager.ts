import { debounce } from "throttle-debounce";
import { NUMBER_OF_ICONS_PER_REQUEST } from "../const/config";
import { IconsStyleData } from "../type/transfer";
import { NamesByTypesSet } from "./NamesByTypesSet";
import { portalApi, PortalApi } from "./PortalApi";

export class IconManager {
    private readonly portalApi: PortalApi;

    private readonly styleElement: HTMLElement;
    private readonly debounceRequestStyle: () => void;
    private readonly additionalStyleElements = new Map<string, Text>();
    private readonly requestedEntities = new NamesByTypesSet();
    private readonly pendingEntities = new NamesByTypesSet();
    private readonly processedEntities = new NamesByTypesSet();

    public constructor(portalApi: PortalApi) {
        this.portalApi = portalApi;

        this.styleElement = document.createElement("style");
        document.head.appendChild(this.styleElement);

        this.debounceRequestStyle = debounce(10, this.requestStyle.bind(this));
    }

    public requestIcon(type: string, name: string): void {
        if (
            this.requestedEntities.has(type, name) ||
            this.pendingEntities.has(type, name) ||
            this.processedEntities.has(type, name)
        ) {
            return;
        }

        this.requestedEntities.add(type, name);
        if (this.requestedEntities.size > NUMBER_OF_ICONS_PER_REQUEST) {
            this.requestStyle();
        }
        this.debounceRequestStyle();
    }

    private requestStyle(): void {
        if (this.requestedEntities.size === 0) {
            return;
        }

        const namesByTypes = this.requestedEntities.getData();
        this.pendingEntities.merge(namesByTypes);
        this.requestedEntities.clear();

        (async (): Promise<void> => {
            try {
                const response = await this.portalApi.getIconsStyle(namesByTypes);
                this.appendStyle(response.style);
                this.processedEntities.merge(response.processedEntities);
            } catch (e) {
                // Ignore any failures to failed style requests.
            }
        })();
    }

    private appendStyle(style: string): void {
        this.styleElement.appendChild(document.createTextNode(style));
    }

    public addAdditionalStyle(name: string, style: IconsStyleData): void {
        let element = this.additionalStyleElements.get(name);
        if (element) {
            element.textContent = style.style;
        } else {
            element = document.createTextNode(style.style);
            this.additionalStyleElements.set(name, element);
            this.styleElement.appendChild(element);
        }

        this.processedEntities.merge(style.processedEntities);
    }
}

export const iconManager = new IconManager(portalApi);
