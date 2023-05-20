export declare const SearchUtil: {
    _process(input: string): string[];
    _compare(string: string, compare: string, ratio?: number): boolean;
    fuzzy(haystack: string[], needle: string[]): boolean;
};
