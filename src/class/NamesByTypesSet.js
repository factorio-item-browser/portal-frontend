// @flow

import type { NamesByTypes } from "../type/transfer";

class NamesByTypesSet {
    /** @private */
    _values: Map<string, Set<string>> = new Map<string, Set<string>>();

    /** @private */
    _getValuesOfType(type: string): Set<string> {
        let values = this._values.get(type);
        if (!values) {
            values = new Set<string>();
            this._values.set(type, values);
        }
        return values;
    }

    /**
     * Adds a new type and name to the set.
     */
    add(type: string, name: string): void {
        this._getValuesOfType(type).add(name);
    }

    /**
     * Returns whether the combination of type and name is part of the set.
     */
    has(type: string, name: string): boolean {
        return this._getValuesOfType(type).has(name);
    }

    /**
     * Removes a type and name from the set, if already there.
     */
    remove(type: string, name: string): void {
        this._getValuesOfType(type).delete(name);
    }

    /**
     * Clears all values from the set.
     */
    clear(): void {
        this._values.clear();
    }

    /**
     * Merges the names and types into the set.
     */
    merge(namesByTypes: NamesByTypes): void {
        for (const type of Object.keys(namesByTypes)) {
            for (const name of namesByTypes[type]) {
                this.add(type, name);
            }
        }
    }

    /**
     * Removes the names and types from the set.
     */
    diff(namesByTypes: NamesByTypes): void {
        for (const type of Object.keys(namesByTypes)) {
            for (const name of namesByTypes[type]) {
                this.remove(type, name);
            }
        }
    }

    /**
     * Returns the current size of the set.
     */
    get size(): number {
        let result = 0;
        for (const names of this._values.values()) {
            result += names.size;
        }
        return result;
    }

    /**
     * Transforms the set to a plain data object.
     */
    getData(): NamesByTypes {
        const result = {};
        for (const [type, names] of this._values) {
            if (names.size > 0) {
                result[type] = [...names];
            }
        }
        return result;
    }
}

export default NamesByTypesSet;
