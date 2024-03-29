import { SidebarEntityData } from "../api/transfer";
import { Config } from "../util/config";
import { CombinationId } from "./CombinationId";

const KEY_CACHE = "cache";
const KEY_SCRIPT_VERSION = "script-version";
const KEY_SIDEBAR_ENTITIES = "sidebar-entities";
const KEY_HASH = "hash";

interface CacheItem<T> {
    data: T;
    time: number;
}

class CacheUtils {
    public static serialize<T>(data: T): string {
        const item: CacheItem<T> = {
            data,
            time: Date.now() + Config.cacheLifetime * 1000,
        };

        return JSON.stringify(item);
    }

    public static deserialize<T>(serializedData: string): T | null {
        let item: CacheItem<T>;
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

    public static clean(storage: Storage): void {
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

    public static clear(storage: Storage, predicate: (key: string) => boolean): void {
        for (const key of Object.keys(storage)) {
            if (key.startsWith(KEY_CACHE) && predicate(key)) {
                storage.removeItem(key);
            }
        }
    }
}

class SidebarEntitiesUtils {
    public static deserialize(data: string): SidebarEntityData[] {
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

    public static serialize(sidebarEntities: SidebarEntityData[]): string {
        return JSON.stringify(sidebarEntities);
    }
}

type SidebarEntitiesChangeHandler = (sidebarEntities: SidebarEntityData[]) => void;

export class StorageManager {
    private readonly storage: Storage;

    public combinationId: CombinationId | null = null;
    public sidebarEntitiesChangeHandler: SidebarEntitiesChangeHandler | null = null;

    private cleanups: (() => void)[] = [
        (): void => CacheUtils.clean(this.storage),
        (): void => CacheUtils.clear(this.storage, (): boolean => true),
    ];

    public constructor(storage: Storage) {
        this.storage = storage;

        window.addEventListener("storage", this.handleStorageEvent.bind(this));
        CacheUtils.clean(storage);
    }

    private buildStorageKey(prefix: string, ...suffixes: string[]): string | undefined {
        if (!this.combinationId) {
            return;
        }

        return [prefix, this.combinationId.toShort(), ...suffixes].join("-");
    }

    private handleStorageEvent(event: StorageEvent): void {
        const sidebarKey = this.buildStorageKey(KEY_SIDEBAR_ENTITIES);
        if (sidebarKey && event.key === sidebarKey && this.sidebarEntitiesChangeHandler) {
            this.sidebarEntitiesChangeHandler(SidebarEntitiesUtils.deserialize(event.newValue || ""));
        }
    }

    private storeItem(key: string, item: string): void {
        const cleanups = this.cleanups.slice();

        while (true) {
            try {
                this.storage.setItem(key, item);
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

    public set scriptVersion(scriptVersion: string) {
        this.storeItem(KEY_SCRIPT_VERSION, scriptVersion);
    }

    public get scriptVersion(): string {
        return this.storage.getItem(KEY_SCRIPT_VERSION) || "";
    }

    public set hash(combinationHash: string) {
        const key = this.buildStorageKey(KEY_HASH);
        if (!key || !this.combinationId) {
            return;
        }

        const existingHash = this.storage.getItem(key) || "";
        if (existingHash !== combinationHash) {
            this.clearCombination(this.combinationId);
            this.storage.setItem(key, combinationHash);
        }
    }

    public set sidebarEntities(sidebarEntities: SidebarEntityData[]) {
        const key = this.buildStorageKey(KEY_SIDEBAR_ENTITIES);
        if (!key) {
            return;
        }

        this.storeItem(key, SidebarEntitiesUtils.serialize(sidebarEntities));
    }

    public get sidebarEntities(): SidebarEntityData[] {
        const key = this.buildStorageKey(KEY_SIDEBAR_ENTITIES);
        if (!key) {
            return [];
        }

        return SidebarEntitiesUtils.deserialize(this.storage.getItem(key) || "");
    }

    public writeToCache<T>(cacheKey: string, data: T): void {
        const storageKey = this.buildStorageKey(KEY_CACHE, cacheKey);
        if (!storageKey) {
            return;
        }

        this.storeItem(storageKey, CacheUtils.serialize<T>(data));
    }

    public readFromCache<T>(cacheKey: string): T | null {
        const storageKey = this.buildStorageKey(KEY_CACHE, cacheKey);
        if (!storageKey) {
            return null;
        }

        const serializedData = this.storage.getItem(storageKey);
        if (!serializedData) {
            return null;
        }

        return CacheUtils.deserialize<T>(serializedData);
    }

    public clearCombination(combinationId: CombinationId): void {
        const prefix = [KEY_CACHE, combinationId.toShort()].join("-");
        CacheUtils.clear(this.storage, (key: string): boolean => key.startsWith(prefix));
    }
}

export const storageManager = new StorageManager(window.localStorage);
