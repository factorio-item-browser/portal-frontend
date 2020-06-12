import NamesByTypesSet from "./NamesByTypesSet";

describe("NamesByTypesSet", () => {
    test("add", () => {
        const set = new NamesByTypesSet();

        expect(set.getData()).toEqual({});

        set.add("abc", "def");
        set.add("ghi", "jkl");
        set.add("abc", "mno");
        set.add("abc", "def");

        expect(set.getData()).toEqual({
            abc: ["def", "mno"],
            ghi: ["jkl"],
        });
    });

    test("has", () => {
        const set = new NamesByTypesSet();
        set.add("abc", "def");
        set.add("abc", "ghi");
        set.add("jkl", "mno");

        expect(set.has("abc", "def")).toStrictEqual(true);
        expect(set.has("abc", "ghi")).toStrictEqual(true);
        expect(set.has("jkl", "mno")).toStrictEqual(true);

        expect(set.has("abc", "mno")).toStrictEqual(false);
        expect(set.has("jkl", "def")).toStrictEqual(false);
        expect(set.has("foo", "bar")).toStrictEqual(false);
    });

    test("remove", () => {
        const set = new NamesByTypesSet();

        set.add("abc", "def");
        set.add("ghi", "jkl");
        set.add("abc", "mno");

        expect(set.getData()).toEqual({
            abc: ["def", "mno"],
            ghi: ["jkl"],
        });

        set.remove("abc", "def");
        expect(set.getData()).toEqual({
            abc: ["mno"],
            ghi: ["jkl"],
        });

        set.remove("abc", "mno");
        expect(set.getData()).toEqual({
            ghi: ["jkl"],
        });

        set.remove("foo", "bar");
        expect(set.getData()).toEqual({
            ghi: ["jkl"],
        });
    });

    test("clear", () => {
        const set = new NamesByTypesSet();

        set.add("abc", "def");
        set.add("ghi", "jkl");
        set.add("abc", "mno");

        expect(set.getData()).toEqual({
            abc: ["def", "mno"],
            ghi: ["jkl"],
        });

        set.clear();
        expect(set.getData()).toEqual({});
    });

    test("merge", () => {
        const set = new NamesByTypesSet();
        set.add("abc", "def");
        set.add("ghi", "jkl");

        const namesByTypes = {
            abc: ["mno"],
            pqr: ["stu"],
        };

        expect(set.getData()).toEqual({
            abc: ["def"],
            ghi: ["jkl"],
        });

        set.merge(namesByTypes);

        expect(set.getData()).toEqual({
            abc: ["def", "mno"],
            ghi: ["jkl"],
            pqr: ["stu"],
        });
    });

    test("diff", () => {
        const set = new NamesByTypesSet();
        set.add("abc", "def");
        set.add("abc", "mno");
        set.add("ghi", "jkl");
        set.add("pqr", "stu");

        const namesByTypes = {
            abc: ["mno"],
            pqr: ["stu"],
        };

        expect(set.getData()).toEqual({
            abc: ["def", "mno"],
            ghi: ["jkl"],
            pqr: ["stu"],
        });

        set.diff(namesByTypes);

        expect(set.getData()).toEqual({
            abc: ["def"],
            ghi: ["jkl"],
        });
    });

    test("size", () => {
        const set = new NamesByTypesSet();

        set.add("abc", "def");
        set.add("ghi", "jkl");
        set.add("abc", "mno");

        expect(set.size).toStrictEqual(3);
    });

    test("iterator", () => {
        const set = new NamesByTypesSet();

        set.add("abc", "def");
        set.add("ghi", "jkl");
        set.add("abc", "mno");

        const expectedValues = [
            ["abc", "def"],
            ["abc", "mno"],
            ["ghi", "jkl"],
        ];

        for (const value of set) {
            expect(value).toEqual(expectedValues.shift());
        }
        expect(expectedValues).toHaveLength(0);
    });
});
