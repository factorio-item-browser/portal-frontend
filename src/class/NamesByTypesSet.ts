import { NamesByTypes } from "../type/transfer";

export class NamesByTypesSet {
    private readonly values = new Map<string, Set<string>>();

    private getValuesOfType(type: string): Set<string> {
        let values = this.values.get(type);
        if (!values) {
            values = new Set<string>();
            this.values.set(type, values);
        }
        return values;
    }

    public add(type: string, name: string): void {
        this.getValuesOfType(type).add(name);
    }

    public has(type: string, name: string): boolean {
        return this.getValuesOfType(type).has(name);
    }

    public remove(type: string, name: string): void {
        this.getValuesOfType(type).delete(name);
    }

    public clear(): void {
        this.values.clear();
    }

    public merge(namesByTypes: NamesByTypes): void {
        for (const type of Object.keys(namesByTypes)) {
            for (const name of namesByTypes[type]) {
                this.add(type, name);
            }
        }
    }

    public diff(namesByTypes: NamesByTypes): void {
        for (const type of Object.keys(namesByTypes)) {
            for (const name of namesByTypes[type]) {
                this.remove(type, name);
            }
        }
    }

    public get size(): number {
        let result = 0;
        for (const names of this.values.values()) {
            result += names.size;
        }
        return result;
    }

    public getData(): NamesByTypes {
        const result: NamesByTypes = {};
        for (const [type, names] of this.values) {
            if (names.size > 0) {
                result[type] = [...names];
            }
        }
        return result;
    }
}
