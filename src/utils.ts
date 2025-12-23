function createEnum<const T extends string[]>(members: T) {
  return Object.fromEntries(members.map((value) => [value, value])) as { [K in T[number]]: K };
}

export { createEnum };
