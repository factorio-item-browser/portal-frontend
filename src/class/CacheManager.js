import { CACHE_LIFETIME, STORAGE_KEY_SETTING_HASH } from "../helper/const";

/**
 * The class managing the local cache.
 * @template T
 */
class Cache {
    /**
     * The actual storage to use.
     * @type {Storage}
     * @private
     */
    _storage;

    /**
     * The namespace of the cache.
     * @type {string}
     * @private
     */
    _namespace;

    /**
     * The life time of the cached items, in seconds.
     * @type {number}
     * @private
     */
    _lifeTime;

    /**
     * Initializes the cache instance.
     * @param {Storage} storage
     * @param {string} namespace
     * @param {number} lifeTime
     */
    constructor(storage, namespace, lifeTime) {
        this._storage = storage;
        this._namespace = namespace;
        this._lifeTime = lifeTime;

        this.cleanup();
    }

    /**
     * Walks through all items managed by this cache.
     * @param {function(string, string): void} callback
     * @private
     */
    _walkThroughItems(callback) {
        const prefix = this._buildCacheKey("");
        for (const [key, value] of Object.entries(this._storage)) {
            if (key.substr(0, prefix.length) === prefix) {
                callback(key, value);
            }
        }
    }

    /**
     * Builds the full cache key for the specified key.
     * @param {string} key
     * @return {string}
     * @private
     */
    _buildCacheKey(key) {
        return ["cache", this._namespace, key].join("-");
    }

    /**
     * Deserializes the cached value, verifying it is still valid.
     * @param {string} cacheValue
     * @return {T|null}
     * @private
     */
    _deserializeCacheValue(cacheValue) {
        let item;
        try {
            item = JSON.parse(cacheValue);
        } catch (e) {
            return null;
        }

        if (typeof item !== "object" || item === null || !item.time || !item.data || item.time < Date.now()) {
            return null;
        }
        return item.data;
    }

    /**
     * Serializes the data for the storage.
     * @param {T} data
     * @return {string}
     * @private
     */
    _serializeData(data) {
        return JSON.stringify({
            data: data,
            time: Date.now() + this._lifeTime * 1000,
        });
    }

    /**
     * Writes the data to the cache.
     * @param {string} key
     * @param {T} data
     */
    write(key, data) {
        this._storage.setItem(this._buildCacheKey(key), this._serializeData(data));
    }

    /**
     * Reads the data from the cache.
     * @param {string} key
     * @return {T|null}
     */
    read(key) {
        const cacheKey = this._buildCacheKey(key);
        const data = this._deserializeCacheValue(this._storage.getItem(cacheKey));
        if (data === null) {
            this._storage.removeItem(cacheKey);
        }
        return data;
    }

    /**
     * Cleans up the cache, removing all already timed out items.
     */
    cleanup() {
        this._walkThroughItems((key, value) => {
            const item = this._deserializeCacheValue(value);
            if (item === null) {
                this._storage.removeItem(key);
            }
        });
    }

    /**
     * Clears all items from the cache.
     */
    clear() {
        this._walkThroughItems((key) => {
            this._storage.removeItem(key);
        });
    }
}

/**
 * The manager of the caches.
 */
class CacheManager {
    /**
     * The cache instances.
     * @type {Object<string, Cache<T>>}
     * @private
     */
    _caches = {};

    /**
     * The hash of the currently loaded setting.
     * @type {string}
     * @private
     */
    _settingHash;

    /**
     * Initializes the cache manager.
     */
    constructor() {
        this._settingHash = window.localStorage.getItem(STORAGE_KEY_SETTING_HASH) || "";

        window.addEventListener("storage", this._handleStorageChange.bind(this));
    }

    /**
     * Handles the change of a storage item.
     * @param {StorageEvent} event
     * @private
     */
    _handleStorageChange(event) {
        if (event.key === STORAGE_KEY_SETTING_HASH && event.newValue !== this._settingHash) {
            window.location.reload();
        }
    }

    /**
     * Creates a new cache instance.
     * @param {string} namespace
     * @return {Cache<T>}
     * @template T
     */
    create(namespace) {
        if (!this._caches[namespace]) {
            this._caches[namespace] = new Cache(window.localStorage, namespace, CACHE_LIFETIME);
        }

        return this._caches[namespace];
    }

    /**
     * Sets the new setting hash.
     * @param {string} settingHash
     */
    setSettingHash(settingHash) {
        if (settingHash !== this._settingHash) {
            for (const cache of Object.values(this._caches)) {
                cache.clear();
            }

            this._settingHash = settingHash;
            window.localStorage.setItem(STORAGE_KEY_SETTING_HASH, settingHash);
        }
    }
}

export const cacheManager = new CacheManager();
