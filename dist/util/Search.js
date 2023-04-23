export const SearchUtil = {
    _process(input) {
        input = input.trim();
        input = input.toLocaleLowerCase();
        let strings = [];
        if (input.includes("#")) {
            input = input.replace("#", "");
        }
        if (input.includes("_")) {
            strings.push(...input.split("_"));
        }
        if (input.includes(" ")) {
            strings.push(...input.split(" "));
        }
        return strings;
    },
    _compare(string, compare, ratio = 0.5) {
        string = string.toLocaleLowerCase();
        compare = compare.toLocaleLowerCase();
        var matches = 0;
        if (string.indexOf(compare) > -1)
            return true;
        for (var i = 0; i < compare.length; i++) {
            string.indexOf(compare[i]) > -1 ? (matches += 1) : (matches -= 1);
        }
        return matches / string.length >= ratio || compare == "";
    },
    fuzzy(haystack, needle) {
        haystack.forEach((s) => haystack.push(...this._process(s)));
        needle.forEach((s) => needle.push(...this._process(s)));
        let foundMatch = false;
        search: for (const node of haystack) {
            for (const search of needle) {
                if (node == search ||
                    node.includes(search) ||
                    this._compare(search, node)) {
                    foundMatch = true;
                    break search;
                }
            }
        }
        return foundMatch;
    },
};
