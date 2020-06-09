class NamesByTypesSet {
    /**
     * The values of the set.
     * @type {Map<string,Set<string>>}
     * @private
     */
    _values = new Map();

    /**
     * Adds a new type and name to the set.
     * @param {string} type
     * @param {string} name
     */
    add(type, name) {
        if (!this._values.has(type)) {
            this._values.set(type, new Set());
        }

        this._values.get(type).add(name);
    }

    /**
     * Returns whether the combination of type and name is part of the set.
     * @param {string} type
     * @param {string} name
     * @returns {boolean}
     */
    has(type, name) {
        return this._values.has(type) && this._values.get(type).has(name);
    }

    /**
     * Removes a type and name from the set, if already there.
     * @param {string} type
     * @param {string} name
     */
    remove(type, name) {
        if (this._values.has(type)) {
            this._values.get(type).delete(name);
        }
    }

    /**
     * Clears all values from the set.
     */
    clear() {
        this._values.clear();
    }

    /**
     * Merges the names and types into the set.
     * @param {NamesByTypes} namesByTypes
     */
    merge(namesByTypes) {
        for (const [type, names] of Object.entries(namesByTypes)) {
            for (const name of names) {
                this.add(type, name);
            }
        }
    }

    /**
     * Removes the names and types from the set.
     * @param {NamesByTypes} namesByTypes
     */
    diff(namesByTypes) {
        for (const [type, names] of Object.entries(namesByTypes)) {
            for (const name of names) {
                this.remove(type, name);
            }
        }
    }

    /**
     * Returns the current size of the set.
     * @returns {number}
     */
    get size() {
        let result = 0;
        for (const names of this._values.values()) {
            result += names.size;
        }
        return result;
    }

    /**
     * Transforms the set to a plain data object.
     * @returns {NamesByTypes}
     */
    getData() {
        const result = {};
        for (const [type, names] of this._values) {
            if (names.size > 0) {
                result[type] = [...names];
            }
        }
        return result;
    }

    /**
     * Iterates over all values.
     * @returns {Generator<[string, string]>}
     */
    *[Symbol.iterator]() {
        for (const [type, names] of this._values) {
            for (const name of names) {
                yield [type, name];
            }
        }
    }
}

export default NamesByTypesSet;
