/** @typedef {{ getAll: () => Promise<Array>, getById: (id: string) => Promise<object|null> }} ProductRepository */
/** @typedef {{ generate: (input: object, signal?: AbortSignal) => Promise<string> }} TryOnRepository */
export {};
