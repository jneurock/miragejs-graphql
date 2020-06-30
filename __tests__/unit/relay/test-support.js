export const encode = (id) => id;

export function createConnection({ edges, pageInfo } = {}) {
  return {
    edges: edges || [],
    pageInfo: pageInfo || {
      hasPreviousPage: null,
      hasNextPage: null,
      startCursor: null,
      endCursor: null,
    },
  };
}

export function createRecords(n) {
  let i = 1;
  const records = [];

  while (i <= n) {
    records.push({ id: `${i}`, foo: `bar${i}` });
    i++;
  }

  return records;
}
