// @flow

import { CACHE_LIFETIME } from "../const/config";
import type { SidebarEntityData } from "../type/transfer";
import CombinationId from "./CombinationId";

const KEY_SCRIPT_VERSION = "script-version";
const KEY_SIDEBAR_ENTITIES = "sidebar-entities";
const KEY_CACHE = "cache";

interface CacheItem<T> {
    data: T;
    time: number;
}

class CacheUtils {
    static serialize<T>(data: T): string {
        const item: CacheItem<T> = {
            data,
            time: Date.now() + CACHE_LIFETIME * 1000,
        };

        return JSON.stringify(item);
    }

    static deserialize<T>(serializedData: string): ?T {
        let item: T;
        try {
            item = JSON.parse(serializedData);
        } catch (e) {
            return null;
        }

        if (typeof item !== "object" || item === null || !item.time || !item.data || item.time < Date.now()) {
            return null;
        }
        return item.data;
    }

    static clean(storage: Storage): void {
        for (const key of Object.keys(storage)) {
            if (key.startsWith(KEY_CACHE)) {
                const item = CacheUtils.deserialize(storage.getItem(key) || "");
                if (item === null) {
                    // E.g. when the lifetime has been exceeded.
                    storage.removeItem(key);
                }
            }
        }
    }
}

class SidebarEntitiesUtils {
    static deserialize(data: string): SidebarEntityData[] {
        try {
            const sidebarEntities = JSON.parse(data);
            if (Array.isArray(sidebarEntities)) {
                return sidebarEntities;
            }
        } catch (e) {
            // Fall through default return.
        }

        return [];
    }

    static serialize(sidebarEntities: SidebarEntityData[]): string {
        return JSON.stringify(sidebarEntities);
    }
}

export class StorageManager {
    /** @private */
    _storage: Storage;
    /** @private */
    _combinationId: ?CombinationId = null;
    /** @private */
    _sidebarEntitiesChangeHandler: (SidebarEntityData[]) => void = (): void => {};
    /** @private */
    _cleanups: (() => void)[] = [(): void => CacheUtils.clean(this._storage), (): void => this._clearItems(KEY_CACHE)];

    constructor(storage: Storage) {
        this._storage = storage;

        window.addEventListener("storage", this._handleStorageEvent.bind(this));
        CacheUtils.clean(storage);
    }

    /** @private */
    _buildStorageKey(prefix: string, ...suffixes: string[]): ?string {
        if (!this._combinationId) {
            return;
        }

        return [prefix, this._combinationId.toShort(), ...suffixes].join("-");
    }

    /** @private */
    _handleStorageEvent(event: StorageEvent): void {
        const sidebarKey = this._buildStorageKey(KEY_SIDEBAR_ENTITIES);
        if (sidebarKey && event.key === sidebarKey) {
            this._sidebarEntitiesChangeHandler(SidebarEntitiesUtils.deserialize(event.newValue || ""));
        }
    }

    /** @private */
    _storeItem(key: string, item: string): void {
        const cleanups = this._cleanups.slice();

        while (true) {
            try {
                this._storage.setItem(key, item);
                return;
            } catch (e) {
                const cleanup = cleanups.shift();
                if (!cleanup) {
                    throw e;
                }
                cleanup();
            }
        }
    }

    /** @private */
    _clearItems(prefix: string): void {
        for (const key of Object.keys(this._storage)) {
            if (key.startsWith(prefix)) {
                this._storage.removeItem(key);
            }
        }
    }

    set combinationId(combinationId: CombinationId): void {
        this._combinationId = combinationId;
    }

    get combinationId(): ?CombinationId {
        return this._combinationId;
    }

    set scriptVersion(scriptVersion: string): void {
        this._storeItem(KEY_SCRIPT_VERSION, scriptVersion);
    }

    get scriptVersion(): string {
        return this._storage.getItem(KEY_SCRIPT_VERSION) || "";
    }

    set sidebarEntities(sidebarEntities: SidebarEntityData[]): void {
        const key = this._buildStorageKey(KEY_SIDEBAR_ENTITIES);
        if (!key) {
            return;
        }

        this._storeItem(key, SidebarEntitiesUtils.serialize(sidebarEntities));
    }

    get sidebarEntities(): SidebarEntityData[] {
        const key = this._buildStorageKey(KEY_SIDEBAR_ENTITIES);
        if (!key) {
            return [];
        }

        return SidebarEntitiesUtils.deserialize(this._storage.getItem(key) || "");
    }

    set sidebarEntitiesChangeHandler(handler: (SidebarEntityData[]) => void): void {
        this._sidebarEntitiesChangeHandler = handler;
    }

    writeToCache<T>(namespace: string, cacheKey: string, data: T): void {
        const storageKey = this._buildStorageKey(KEY_CACHE, namespace, cacheKey);
        if (!storageKey) {
            return;
        }

        this._storeItem(storageKey, CacheUtils.serialize<T>(data));
    }

    readFromCache<T>(namespace: string, cacheKey: string): ?T {
        const storageKey = this._buildStorageKey(KEY_CACHE, namespace, cacheKey);
        if (!storageKey) {
            return null;
        }

        const serializedData = this._storage.getItem(storageKey);
        if (!serializedData) {
            return null;
        }

        return CacheUtils.deserialize<T>(serializedData);
    }
}

export const storageManager = new StorageManager(window.localStorage);
