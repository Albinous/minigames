if (globalThis.CSS === undefined || typeof globalThis.CSS.escape !== 'function') {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    value: {
      escape: (value: string): string => value.replaceAll(/[^\w-]/g, (char) => `\\${char}`),
    },
  });
}
