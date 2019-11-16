/**
 * The class managing the local cache.
 * @template T
 */
class Cache {
    /**
     * The namespace to use for the cache.
     * @type {string}
     * @private
     */
    _namespace;

    /**
     * The maximal age of cache items to allow, in milliseconds.
     * @type {number}
     */
    _maxAge;

    /**
     * The storage to use for the cache.
     * @type {Storage}
     * @private
     */
    _storage;

    /**
     * Initializes the cache.
     * @param {string} namespace
     * @param {number} maxAge
     */
    constructor(namespace, maxAge) {
        this._namespace = namespace;
        this._maxAge = maxAge;

        this._storage = window.localStorage;
    }

    /**
     * Returns the cache key.
     * @param {string} key
     * @returns {string}
     * @private
     */
    _buildCacheKey(key) {
        return `${this._namespace}-${key}`;
    }

    /**
     * Writes data to the cache.
     * @param {string} key
     * @param {T} data
     */
    write(key, data) {
        this._storage.setItem(
            this._buildCacheKey(key),
            JSON.stringify({
                "data": data,
                "time": Date.now(),
            })
        );
    }

    /**
     * Tries to read data from the cache.
     * @param {string} key
     * @return {T|null}
     */
    read(key) {
        const cacheKey = this._buildCacheKey(key);

        let cacheItem;
        try {
            cacheItem = JSON.parse(this._storage.getItem(cacheKey));
        } catch(e) {
            return null;
        }

        if (typeof(cacheItem) !== "object" || cacheItem === null || !cacheItem.time || !cacheItem.data) {
            return null;
        }
        if (cacheItem.time + this._maxAge < Date.now()) {
            // Item timed out, so remove it from the cache.
            this._storage.removeItem(cacheKey);
            return null;
        }
        return cacheItem.data;
    }
}

export default Cache;
