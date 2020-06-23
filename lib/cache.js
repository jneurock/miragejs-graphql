const cache = [];

/**
 * TODO: Document this
 * 
 * @param {*} param0 
 */
export function getCache({ key, schema }) {
  return cache.find((entry) => key === entry.key && schema === entry.schema);
}

/**
 * TODO: Document this
 * 
 * @param {*} entry 
 */
export function putCache(entry) {
  const existingEntry = getCache(entry);

  if (existingEntry) {
    existingEntry.value = entry.value;
  } else {
    cache.push(entry);
  }

  return entry;
}
