

export * from "./List/DataLog/DataLog.js";

export const wait = (t: number) =>
  new Promise((res) => setTimeout(() => res(true), t));
