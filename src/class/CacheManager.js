import { CACHE_LIFETIME, STORAGE_KEY_SETTING_HASH } from "../helper/const";

/**
 * The prefix used for the cache keys.
 * @type {string}
 */
const CACHE_PREFIX = "cache";

/**
 * An utility class used by the caches and the cache manager.
 */
class CacheUtils {
    /**
     * Builds the key to use for the item.
     * @param {string} namespace
     * @param {string} itemKey
     * @return {string}
     */
    static buildKey(namespace, itemKey) {
        return [CACHE_PREFIX, namespace, itemKey].join("-");
    }

    /**
     * Serializes the data for the cache.
     * @param {*} data
     * @param {number} lifeTime
     * @return {string}
     */
    static serialize(data, lifeTime) {
        return JSON.stringify({
            data: data,
            time: Date.now() + lifeTime * 1000,
        });
    }

    /**
     * Deserializes the value from the cache, also checking its life time.
     * @param {string} value
     * @return {*|null}
     */
    static deserialize(value) {
        let item;
        try {
            item = JSON.parse(value);
        } catch (e) {
            return null;
        }

        if (typeof item !== "object" || item === null || !item.time || !item.data || item.time < Date.now()) {
            return null;
        }
        return item.data;
    }
}

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
    }

    /**
     * Writes the data to the cache.
     * @param {string} key
     * @param {T} data
     */
    write(key, data) {
        this._storage.setItem(CacheUtils.buildKey(this._namespace, key), CacheUtils.serialize(data, this._lifeTime));
    }

    /**
     * Reads the data from the cache.
     * @param {string} key
     * @return {T|null}
     */
    read(key) {
        const cacheKey = CacheUtils.buildKey(this._namespace, key);
        const data = CacheUtils.deserialize(this._storage.getItem(cacheKey));
        if (data === null) {
            this._storage.removeItem(cacheKey);
        }
        return data;
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
     * The storage to use for all the caches.
     * @type {Storage}
     * @private
     */
    _storage = window.localStorage;

    /**
     * Initializes the cache manager.
     */
    constructor() {
        this._settingHash = this._storage.getItem(STORAGE_KEY_SETTING_HASH) || "";
        this.clean();

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
     * Returns the cache instance of the specified namespace.
     * @param {string} namespace
     * @return {Cache<T>}
     * @template T
     */
    get(namespace) {
        if (!this._caches[namespace]) {
            this._caches[namespace] = new Cache(this._storage, namespace, CACHE_LIFETIME);
        }
        return this._caches[namespace];
    }

    /**
     * Sets the new setting hash.
     * @param {string} settingHash
     */
    setSettingHash(settingHash) {
        if (settingHash !== this._settingHash) {
            this.clear();

            this._settingHash = settingHash;
            this._storage.setItem(STORAGE_KEY_SETTING_HASH, settingHash);
        }
    }

    /**
     * Cleans all items from the caches of which the life time is already exceeded.
     */
    clean() {
        for (const [key, value] of Object.entries(this._storage)) {
            if (key.startsWith(CACHE_PREFIX)) {
                const item = CacheUtils.deserialize(value);
                if (item === null) {
                    this._storage.removeItem(key);
                }
            }
        }
    }

    /**
     * Clears all values from the cache.
     */
    clear() {
        for (const key of Object.keys(this._storage)) {
            if (key.startsWith(CACHE_PREFIX)) {
                this._storage.removeItem(key);
            }
        }
    }
}

export const cacheManager = new CacheManager();
