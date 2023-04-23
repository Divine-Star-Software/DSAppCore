export * from "./DataLog/DataLog.js";
export const wait = (t) => new Promise((res) => setTimeout(() => res(true), t));
